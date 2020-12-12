import React, { useState, useEffect } from "react"
import ThreeGlobe from "three-globe"
import * as THREE from "three"
import { createGlowMesh, defaultOptions } from "three-glow-mesh"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Interaction } from "three.interaction"
import { Tween, Easing, update } from "es6-tween"

export default function Globe(props) {
  const [globe, setGlobe] = useState()
  // const [globeReady, setGlobeReady] = useState(false)
  const [globeScene, setGlobeScene] = useState()
  const [globeCamera, setGlobeCamera] = useState()
  const [globeRenderer, setGlobeRenderer] = useState()
  const [cameraFocusedFromMarker, setCameraFocusedFromMarker] = useState(false)
  const [globeControls, setGlobeControls] = useState()
  const [hoverFocusedMarker, setHoverFocusedMarker] = useState(null)
  const [focusedMarker, setFocusedMarker] = useState(null)
  const [markerObj, setMarkerObj] = useState()
  const [cameraFocused, setCameraFocused] = useState(false)
  const [initalCameraPosition, setInitialCameraPosition] = useState(null)
  const [cloudLayer, setCloudLayer] = useState(null)

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    const containerElem = document.getElementById("globeContainer")

    containerElem.innerHTML = ""
    containerElem.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera()
    const options = {
      ...defaultOptions, // console.log this for reference
      backside: false,
      coefficient: .75,
      color: "gold",
      size: 1,
      power: .5
    }

    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.autoRotate = true
    const interaction = new Interaction(renderer, scene, camera)
    var marks = {}
    var animations = []
    var counter = 0
    const myGlobe = new ThreeGlobe()
      .globeImageUrl(`${window.location.protocol}//${window.location.host}${window.location.pathname}/map.jpg`)
      .bumpImageUrl(`${window.location.protocol}//${window.location.host}${window.location.pathname}/bumpmap.jpg`)
      .customLayerData(props.markers)
      .customThreeObject(d => {
        var orignalMesh = new THREE.Mesh(
          new THREE.SphereGeometry(d.radius),
          new THREE.MeshLambertMaterial({color: d.color})
        )

        let glo = createGlowMesh(orignalMesh.geometry, options)

        orignalMesh.add(glo)
        return orignalMesh
      })
      .customThreeObjectUpdate((obj, d) => {
        var coords = myGlobe.getCoords(d.lat, d.lng, d.alt)
        var source = Object.assign({}, coords)
        if(d.lat >= 0){
          source.y = source.y+300
        }else{
          source.y = source.y-300
        }
        var tween = new Tween(source)
        .to({ x: coords.x, y: coords.y, z: coords.z }, 120)
        .easing(Easing.Quadratic.Out)
        .on("update", () => {
          Object.assign(obj.position, source)
        })
        .on("complete", () => {
          if(counter < animations.length){
            animations[counter].start()
            counter++
          }else{
            counter = 0
            animations = []
          }
        })
        animations.push(tween)
        if (counter==0){
          tween.start()
          counter++
        }
        marks[d.id] = obj
        obj.cursor = "pointer"
        obj.on("click", function (ev) {
          props.setFocusedMarker(ev.data.target.__data.id)
          orbitControls.autoRotate = false
          orbitControls.dampingFactor = 0
          if (cameraFocused != true) {
            setCameraFocusedFromMarker(true)
          }
        })
        obj.on("mouseover", function (ev) {
          ev.target.scale.set(1.5, 1.5, 1.5)
        })
        obj.on("mouseout", function (ev) {
          ev.data.target.scale.set(1, 1, 1)
        })
      })
      .onReady(()=>{props.setLoadingGlobe(false)})
    setGlobe(myGlobe)
    setMarkerObj(marks)

    var cloudsGeometry = new THREE.SphereGeometry(101, 75, 75)
    var cloudsMaterial = new THREE.MeshLambertMaterial({
      transparent: true,
      map: THREE.ImageUtils.loadTexture(`${window.location.protocol}//${window.location.host}${window.location.pathname}/clouds.png`)
    })
    cloudsMaterial.opacity = 0.3

    const cloudLayer = new THREE.Mesh(cloudsGeometry, cloudsMaterial)
    setCloudLayer(cloudLayer)

    scene.add(myGlobe)
    scene.add(cloudLayer)

    const topLight = new THREE.DirectionalLight(0xffffff, 0.5)
    topLight.position.set(0, 1, 0)
    scene.add(topLight)

    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.75)
    bottomLight.position.set(0, -1, 0)
    scene.add(bottomLight)

    const rightLight = new THREE.DirectionalLight(0xffffff, 0.5)
    rightLight.position.set(-10, 0, 0)
    scene.add(rightLight)

    const leftLight = new THREE.DirectionalLight(0xffffff, 0.5)
    leftLight.position.set(10, 0, 0)
    scene.add(leftLight)

    const backLight = new THREE.DirectionalLight(0xffffff, 0.75)
    backLight.position.set(0, 10, -10)
    scene.add(backLight)

    const frontLight = new THREE.DirectionalLight(0xffffff, 0.75)
    frontLight.position.set(0, 10, 10)
    scene.add(frontLight)

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    camera.position.set(
      -415.2971330601325,
      157.35740158480883,
      -14.427464555977274
    )

    setGlobeCamera(camera)

    orbitControls.autoRotateSpeed = 1.0
    orbitControls.enableDamping = true
    orbitControls.enablePan = false
    orbitControls.maxDistance = 800
    orbitControls.zoomSpeed = 0.8
    orbitControls.rotateSpeed = 1.5
    orbitControls.minZoom = 300
    orbitControls.saveState()
    setGlobeControls(orbitControls)
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", onWindowResize, false)

    function render() {
      // find intersections

      ;["x", "y", "z"].forEach(function (axis) {
        cloudLayer.rotation[axis] += Math.random() / 1000
      })

      orbitControls.update()
      renderer.render(scene, camera)
    }
    function animate(time) {
      requestAnimationFrame(animate)
      update(time)
      render()
    }

    animate()
    setGlobeScene(scene)
  }, [])

  useEffect(() => {
    if (cameraFocusedFromMarker) {
      setInitialCameraPosition({
        x: globeCamera.position.x,
        y: globeCamera.position.y,
        z: globeCamera.position.z
      })
    }
  }, [cameraFocusedFromMarker])

  useEffect(() => {
    if (props.hoverFocusedMarker != null) {
      markerObj[props.hoverFocusedMarker].scale.set(1.5, 1.5, 1.5)
      setHoverFocusedMarker(markerObj[props.hoverFocusedMarker])
    } else if (props.hoverFocusedMarker == null) {
      if (hoverFocusedMarker != null) {
        hoverFocusedMarker.scale.set(1, 1, 1)
        setHoverFocusedMarker(null)
      }
    }
  }, [props.hoverFocusedMarker])

  useEffect(() => {
    if (props.focusedMarker != null) {
      if (
        markerObj[props.focusedMarker] != focusedMarker &&
        focusedMarker != null
      ) {
        focusedMarker.scale.set(1, 1, 1)
      }
      let marker = markerObj[props.focusedMarker]
      marker.scale.set(1.5, 1.5, 1.5)
      let coords = globe.getCoords(marker.__data.lat, marker.__data.lng, 1.1)

      let camCoords = {
        x: globeCamera.position.x,
        y: globeCamera.position.y,
        z: globeCamera.position.z
      }
      if (cameraFocused != true) {
        setCameraFocused(true)
        setInitialCameraPosition({
          x: camCoords.x,
          y: camCoords.y,
          z: camCoords.z
        })
      }

      var tween = new Tween(camCoords)
        .to({ x: coords.x, y: coords.y, z: coords.z }, 1600)
        .easing(Easing.Quadratic.Out)
        .on("update", () => {
          globeCamera.position.set(camCoords.x, camCoords.y, camCoords.z)
        })
        .on("complete", () => {
          props.setVisible(true)
          props.setImage(marker.__data.image)
          props.setImageCaption(marker.__data.unsplash_profile)
        })
        .start()

      globeControls.dampingFactor = 0

      setFocusedMarker(marker)
    } else if (props.focusedMarker == null) {
      if (focusedMarker != null) {
        focusedMarker.scale.set(1, 1, 1)
        globeControls.autoRotate = true

        setCameraFocused(false)
        let camCoords = {
          x: globeCamera.position.x,
          y: globeCamera.position.y,
          z: globeCamera.position.z
        }
        var tween = new Tween(camCoords)
          .to(
            {
              x: initalCameraPosition.x,
              y: initalCameraPosition.y,
              z: initalCameraPosition.z
            },
            1000
          )
          .easing(Easing.Quadratic.Out)
          .on("update", () => {
            globeCamera.position.set(camCoords.x, camCoords.y, camCoords.z)
          })
          .start()

        globeControls.dampingFactor = 0.05
      }
    }
  }, [props.focusedMarker])

  if (props.focusedMarker != null) {
    markerObj[props.focusedMarker].scale.set(1.5, 1.5, 1.5)
  }

  useEffect(() => {
    if (globe) {
      globe.customLayerData(props.markers)
    }
  }, [props.markers])

  useEffect(() => {
    if (props.enhanced == true) {
      var backgroundgeometry = new THREE.SphereBufferGeometry(600, 15, 15)

      var backgroundmaterial = new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        map: THREE.ImageUtils.loadTexture(`${window.location.protocol}//${window.location.host}${window.location.pathname}/background.png`)
      })

      const globeBackground = new THREE.Mesh(
        backgroundgeometry,
        backgroundmaterial
      )

      globeScene.add(globeBackground)
    }
  }, [props.enhanced])

  return null
}
