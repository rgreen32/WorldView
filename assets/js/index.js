var camera, scene, renderer
var geometry, material, mesh

init()
animate()

function init() {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    10
  )
  camera.position.z = 5.5

  scene = new THREE.Scene()
  var light = new THREE.DirectionalLight(0xcccccc, 1)
  light.position.set(5, 15, 5)
  scene.add(light)
  scene.add(new THREE.AmbientLight(0x888888))

  geometry = new THREE.SphereGeometry(3, 50, 50)
  material = new THREE.MeshPhongMaterial()
  material.map = THREE.ImageUtils.loadTexture("assets/media/map.jpg")

  material.bumpMap = THREE.ImageUtils.loadTexture("assets/media/bumpmap.jpg")
  material.bumpScale = 0.05

  material.specularMap = THREE.ImageUtils.loadTexture(
    "assets/media/earthspec.jpg"
  )
  material.specular = new THREE.Color("grey")
  mesh = new THREE.Mesh(geometry, material)

  // create the geometry sphere
  galaxygeometry = new THREE.SphereGeometry(90, 32, 32)
  // create the material, using a texture of startfield
  galaxymaterial = new THREE.MeshBasicMaterial()
  galaxymaterial.map = THREE.ImageUtils.loadTexture("assets/media/stars.jpg")
  galaxymaterial.side = THREE.BackSide
  // create the mesh based on geometry and material
  galaxymesh = new THREE.Mesh(galaxygeometry, galaxymaterial)

  scene.add(galaxymesh)
  scene.add(mesh)
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
}

function animate() {
  requestAnimationFrame(animate)

  mesh.rotation.y += 0.01

  renderer.render(scene, camera)
}
