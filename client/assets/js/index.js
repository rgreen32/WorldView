async function main() {
  async function fetchImages() {
    let response = await fetch("http://127.0.0.1:5000/")
    let data = await response.json()
    return data
  }
  gData = await fetchImages().then(data => {
    return data
  })

  gData.forEach(entry => {
    entry.size = 0.05
    entry.color = "white"
  })

  const Globe = new ThreeGlobe()
    .globeImageUrl("assets/media/map.jpg")
    .bumpImageUrl("assets/media/bumpmap.jpg")
    .pointsData(gData)
    .pointAltitude("size")
    .pointColor("color")
    .pointRadius(2)

  setTimeout(() => Globe.polygonAltitude(() => 0.2, 400))

  // Setup renderer
  const renderer = new THREE.WebGLRenderer()

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  document.getElementById("globeViz").appendChild(renderer.domElement)

  // Setup scene
  const scene = new THREE.Scene()
  scene.add(Globe)

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
  // scene.add(new THREE.AmbientLight(0xbbbbbb, 2))
  // Setup camera
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

  var modal = document.getElementById("myModal")
  var imageFrame = document.getElementById("imageFrame")

  var closespan = document.getElementById("close")
  closespan.addEventListener(
    "click",
    function() {
      modal.style.display = "none"
    },
    false
  )
  window.addEventListener("click", function(event) {}, false)

  function onMouseClick(event) {
    event.preventDefault()
    // console.log("X", event.clientX, "Y", event.clientY)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)

    var intersects = raycaster.intersectObjects(scene.children, true)

    if (intersects.length > 2) {
      if (intersects[0].object["__globeObjType"] == "point") {
        image = document.createElement("IMG")
        image.className = "image"
        console.log(intersects[0].object["__data"])
        image.setAttribute("src", intersects[0].object["__data"]["image"])
        imageFrame.appendChild(image)
        console.log(modal)
        modal.style.display = "block"
      }
    } else {
      if (event.target != modal) {
        imageFrame.innerHTML = ""
        modal.style.display = "none"
      }
    }
  }
  document.addEventListener("click", onMouseClick, false)

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
}
main()
