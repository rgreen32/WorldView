// Gen random data
const N = 1
// const gData = [...Array(N).keys()].map(() => ({
//   lat: 39.8283,
//   lng: -98.5795,
//   size: Math.random() / 3,
//   color: ["red", "white", "blue", "green"][Math.round(Math.random() * 3)]
// }))

const gData = [
  {
    lat: 39.8283,
    lng: -98.5795,
    size: 0.05,
    color: "white",
    image:
      "https://lh3.googleusercontent.com/proxy/kFi5fYBYma3Rniy8byPd94yv_hzn0M1rsWcfxy_wddAGvugpTGITQP6Ihqz_-MsUbhCaJk1c6D3J1PeU3KAoZpwKb0ql2elpCgS1"
  }
]

// const Globe = new ThreeGlobe()
//   .globeImageUrl("assets/media/map.jpg")
//   .bumpImageUrl("assets/media/bumpmap.jpg")
//   .pointsData(gData)
//   .pointAltitude("size")
//   .pointColor("color")

const Globe = new ThreeGlobe()
  .globeImageUrl("assets/media/map.jpg")
  .bumpImageUrl("assets/media/bumpmap.jpg")
  .pointsData(gData)
  .pointAltitude("size")
  .pointColor("color")
  .pointRadius(2)
// .polygonsData([
//   {
//     type: "Feature",
//     properties: { scalerank: 1, NAME: "Afghanistan" },
//     bbox: [60.52843, 29.318572, 75.158028, 38.486282],
//     geometry: {
//       type: "Polygon",
//       coordinates: [
//         [
//           [61.210817, 35.650072],
//           [91.210817, 35.650072],
//           [91.210817, 65.650072],
//           [61.210817, 65.650072],
//           [61.210817, 35.650072]
//         ]
//       ]
//     },
//     __id: "348559831"
//   }
// ])
// .polygonCapColor(() => "rgba(200, 0, 0, 0.7)")
// .polygonSideColor(() => "rgba(0, 200, 0, 0.1)")
// .polygonStrokeColor(() => "#111")

setTimeout(() => Globe.polygonAltitude(() => 0.2, 400))
// setTimeout(() => {
//   gData.forEach(d => (d.size = Math.random()))
//   Globe.pointsData(gData)
// }, 100)

// Setup renderer
const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.getElementById("globeViz").appendChild(renderer.domElement)

// Setup scene
const scene = new THREE.Scene()
scene.add(Globe)
// scene.add(new THREE.AmbientLight(0xbbbbbb))

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

function onMouseClick(event) {
  event.preventDefault()
  // console.log("X", event.clientX, "Y", event.clientY)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  raycaster.setFromCamera(mouse, camera)

  var intersects = raycaster.intersectObjects(scene.children, true)

  if (intersects.length > 2) {
    if (intersects[0].object["__globeObjType"] == "point") {
      window.open(intersects[0].object["__data"]["image"])
    }
  } else {
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
