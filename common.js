var renderer, scene, camera, myCanvas = document.getElementById('myCanvas');

renderer = new THREE.WebGLRenderer({ canvas: myCanvas, antilias: true});
renderer.setClearColor(0xd1d1d1);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);

scene = new THREE.Scene();

var light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);
light2 = new THREE.PointLight(0xffffff, 0.8, 18);
light2.position.set(-3,6,-3);
light2.castShadow = true;
light2.shadow.camera.near = 0.1;
light2.shadow.camera.far = 25;
scene.add(light2);


var loader = new THREE.JSONLoader();
loader.load('life-net.json', handle_load);

var mesh;
var mixer;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

function handle_load(geometry, materials) {

  var material = new THREE.MeshLambertMaterial({color: 0xea5355});

  mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);
  mesh.position.z = -10;
  mesh.rotation.y = -1.5;

  mixer = new THREE.AnimationMixer(mesh);

  var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('talk', geometry.morphTargets, 30);
  mixer.clipAction(clip).setDuration(1).play();
}

render();

var delta = 0;
var prevTime = Date.now();

function render() {

  delta += 0.1;

  if (mesh) {
    mesh.rotation.y -= 0.03;
  }

  if (mixer) {
    var time = Date.now();
    mixer.update((time - prevTime) * 0.001);
    prevTime = time;
  }

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
