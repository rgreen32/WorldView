import React, { useState, useEffect } from "react"
import ThreeGlobe from "three-globe"
import * as THREE from "three"
import TrackballControls from "three-trackballcontrols"

export default function Globe(props) {
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  const containerElem = document.getElementById("globeContainer")

  containerElem.innerHTML = ""
  containerElem.appendChild(renderer.domElement)
  const myGlobe = new ThreeGlobe()
    .globeImageUrl("/map.jpg")
    .bumpImageUrl("/bumpmap.jpg")
    .pointsData(props.markers)
    .pointAltitude("size")
    .pointColor("color")
    .pointRadius(2)

  var geometry = new THREE.SphereGeometry(90, 32, 32)
  var material = new THREE.MeshBasicMaterial()
  material.map = THREE.ImageUtils.loadTexture("background.png")
  material.side = THREE.BackSide

  var globeBackground = new THREE.Mesh(geometry, material)

  // var material = new THREE.MeshBasicMaterial({
  //   side: THREE.BackSide
  // })
  // material.map = THREE.ImageUtils.loadTexture("/background.png")
  // const globeBackground = new THREE.Mesh(geometry, material)

  const scene = new THREE.Scene()
  scene.add(globeBackground)
  scene.add(myGlobe)

  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  // scene.add(ambientLight)

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

  const camera = new THREE.PerspectiveCamera()
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  camera.position.z = 400

  // Add camera controls
  const tbControls = new TrackballControls(camera, renderer.domElement)
  tbControls.minDistance = 101
  tbControls.rotateSpeed = 5
  tbControls.zoomSpeed = 0.8

  var raycaster = new THREE.Raycaster()
  var mouse = new THREE.Vector2()

  //   var modal = document.getElementById("myModal")
  //   var imageFrame = document.getElementById("imageFrame")

  //   var closespan = document.getElementById("close")
  //   closespan.addEventListener(
  //     "click",
  //     function() {
  //       modal.style.display = "none"
  //     },
  //     false
  //   )
  //   window.addEventListener("click", function(event) {}, false)

  //   function onMouseClick(event) {
  //     event.preventDefault()
  //     // console.log("X", event.clientX, "Y", event.clientY)
  //     mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  //     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  //     raycaster.setFromCamera(mouse, camera)

  //     var intersects = raycaster.intersectObjects(scene.children, true)

  //     if (intersects.length > 2) {
  //       if (intersects[0].object["__globeObjType"] == "point") {
  //         image = document.createElement("IMG")
  //         image.className = "image"
  //         console.log(intersects[0].object["__data"])
  //         image.setAttribute("src", intersects[0].object["__data"]["image"])
  //         imageFrame.appendChild(image)
  //         console.log(modal)
  //         modal.style.display = "block"
  //       }
  //     } else {
  //       if (event.target != modal) {
  //         imageFrame.innerHTML = ""
  //         modal.style.display = "none"
  //       }
  //     }
  //   }
  //   document.addEventListener("click", onMouseClick, false)

  function onMouseMove(event) {
    event.preventDefault()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  }
  document.addEventListener("mousemove", onMouseMove, false)

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener("resize", onWindowResize, false)
  var INTERSECTED

  function render() {
    // find intersections
    raycaster.setFromCamera(mouse, camera)

    var intersects = raycaster.intersectObjects(scene.children, true)

    if (intersects.length > 2) {
      if (
        INTERSECTED != intersects[0].object &&
        intersects[0].object["__globeObjType"] == "point"
      ) {
        if (INTERSECTED) {
          INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
        }
        INTERSECTED = intersects[0].object
        INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()
        INTERSECTED.material.emissive.setHex(0x8e1600)
      }
    } else {
      if (INTERSECTED) {
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
      }
      INTERSECTED = null
    }

    tbControls.update()

    // renderer.render(scene, camera)
    renderer.render(scene, camera)
  }
  function animate() {
    requestAnimationFrame(animate)

    render()
  }

  animate()

  return null
}
