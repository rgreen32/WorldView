import React, { useState, useEffect } from "react"
import ThreeGlobe from "three-globe"
import * as THREE from "three"
import { createGlowMesh, defaultOptions } from "three-glow-mesh"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Interaction } from "three.interaction"

export default function Globe(props) {
  const [globe, setGlobe] = useState()
  const [globeScene, setGlobeScene] = useState()
  const [globeCamera, setGlobeCamera] = useState()
  const [globeRenderer, setGlobeRenderer] = useState()
  const [globeControls, setGlobeControls] = useState()
  const [hoverFocusedMarker, setHoverFocusedMarker] = useState(null)
  const [focusedMarker, setFocusedMarker] = useState(null)
  const [markerObj, setMarkerObj] = useState()
  const [cameraFocused, setCameraFocused] = useState(false)
  const [initalCameraPosition, setInitialCameraPosition] = useState(null)

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
      coefficient: 0,
      color: "white",
      size: 5,
      power: 7
    }
    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.autoRotate = true
    const interaction = new Interaction(renderer, scene, camera)
    var marks = {}
    const myGlobe = new ThreeGlobe()
      .globeImageUrl("/map.jpg")
      .bumpImageUrl("/bumpmap.jpg")
      .customLayerData(props.markers)
      .customThreeObject(d => {
        var orignalMesh = new THREE.Mesh(
          new THREE.SphereGeometry(d.radius),
          new THREE.MeshLambertMaterial({ color: d.color })
        )

        let glo = createGlowMesh(orignalMesh.geometry, options)

        orignalMesh.add(glo)
        return orignalMesh
      })
      .customThreeObjectUpdate((obj, d) => {
        Object.assign(obj.position, myGlobe.getCoords(d.lat, d.lng, d.alt))
        marks[d.id] = obj
        obj.cursor = "pointer"
        obj.on("click", function(ev) {
          props.setFocusedMarker(ev.data.target.__data.id)
          setCameraFocused(true)
          setInitialCameraPosition(camera.position)
          let position = myGlobe.getCoords(
            ev.data.target.__data.lat,
            ev.data.target.__data.lng,
            0.5
          )
          // focusCamera(ev.data.target.__data)
          // orbitControls.enabled = false
          // orbitControls.autoRotate = false
          // console.log(orbitControls.dampingFactor)
          orbitControls.dampingFactor = 0
          if (focusedMarker != ev.data.target) {
          }

          camera.position.set(position.x, position.y, position.z)
        })

        obj.on("mouseover", function(ev) {
          ev.target.scale.set(1.5, 1.5, 1.5)
        })

        obj.on("mouseout", function(ev) {
          ev.data.target.scale.set(1, 1, 1)
        })
      })
    setGlobe(myGlobe)
    setMarkerObj(marks)
    var backgroundgeometry = new THREE.SphereBufferGeometry(400, 15, 15)

    var backgroundmaterial = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      map: THREE.ImageUtils.loadTexture("/background.png")
    })

    const globeBackground = new THREE.Mesh(
      backgroundgeometry,
      backgroundmaterial
    )

    // var sungeometry = new THREE.SphereGeometry(50, 13, 13)
    // var sunmaterial = new THREE.MeshLambertMaterial()
    // const sun = new THREE.Mesh(sungeometry, sunmaterial)

    // scene.add(sun)

    // scene.add(globeBackground)
    scene.add(myGlobe)

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
    // camera.position.x = -400
    // camera.position.z = 100
    camera.position.set(0, 0, 320)
    setGlobeCamera(camera)
    // camera.fov = 100
    // camera.updateProjectionMatrix()

    // Add camera controls

    // orbitControls.autoRotate = true
    orbitControls.autoRotateSpeed = 3.0
    orbitControls.enableDamping = true
    orbitControls.enablePan = false
    orbitControls.minDistance = 101
    orbitControls.rotateSpeed = 5
    orbitControls.zoomSpeed = 0.8
    orbitControls.rotateSpeed = 1.5
    orbitControls.saveState()
    setGlobeControls(orbitControls)
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", onWindowResize, false)
    var INTERSECTED

    function render(val) {
      // find intersections

      orbitControls.update()
      renderer.render(scene, camera)
    }
    function animate() {
      let val = requestAnimationFrame(animate)
      render(val)
    }

    animate()
  }, [])
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
      let coords = globe.getCoords(marker.__data.lat, marker.__data.lng, 0.5)
      let x = globeCamera.position.x
      let y = globeCamera.position.y
      let z = globeCamera.position.z
      setInitialCameraPosition({
        x: x,
        y: y,
        z: z
      })
      globeCamera.position.set(coords.x, coords.y, coords.z)

      globeControls.dampingFactor = 0

      setFocusedMarker(marker)
    } else if (props.focusedMarker == null) {
      if (focusedMarker != null) {
        focusedMarker.scale.set(1, 1, 1)
        globeCamera.position.set(
          initalCameraPosition.x,
          initalCameraPosition.y,
          initalCameraPosition.z
        )
        globeControls.dampingFactor = 0.05
      }
    }
  }, [props.focusedMarker])
  if (props.focusedMarker != null) {
    markerObj[props.focusedMarker].scale.set(1.5, 1.5, 1.5)
  }

  function focusCamera(marker) {
    setCameraFocused(true)
    setInitialCameraPosition(globeCamera.position)
    props.setFocusedMarker(marker.id)
    setCameraFocused(true)
    setInitialCameraPosition(globeCamera.position)
    let position = globe.getCoords(marker.__data.lat, marker.__data.lng, 0.5)

    globeControls.dampingFactor = 0
    if (focusedMarker != marker) {
    }

    globeCamera.position.set(position.x, position.y, position.z)
  }

  return null
}
