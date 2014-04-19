/**
 * main.js
 *
 * @overview A work in progress - demonstration of the Foucault Pendulum.
 *
 * @author Nate Beatty | {@link http://natebeatty.com|tnbeatty}
 * @copyright All Rights Reserved - 2014
 *
 */

var MYENV = { // The variables that define the game environment
  width: window.innerWidth,
  height: window.innerHeight,
  aspect: window.innerWidth / window.innerHeight,
  scene: {
    bgColor: '#D6F1FF',
    floorColor: 0xEDCBA0,
    pendulumColor: 0x8000FF,
    lightColor: 0xF7EFBE
  },
  pendulum: {
    length: 350,
    rotRateEarth: 360, // degrees per day
    latitude: 0 // latitude of the pendulum on the earth
  }
}

// Global variables
var scene, skyscene, camera, skycamera, renderer;
var pBob, pPivot;
var clock = new THREE.Clock(true);
var isAnimating = true;

function init() {
  scene = new THREE.Scene();
  skyscene = new THREE.Scene();

  // Set up the camera
  camera = new THREE.PerspectiveCamera(60, MYENV.aspect, 1, 100000); // FOV, Aspect, Near, Far
  camera.position.y = 200;
  camera.position.z = 700;
  scene.add(camera);

  skycamera = new THREE.PerspectiveCamera(60, MYENV.aspect, 1, 100000);

  // Set up the scene
  buildScene();

  var path = "assets/textures/";
  var format = '.jpg';
  var urls = [
    path + 'px' + format, path + 'nx' + format,
    path + 'py' + format, path + 'ny' + format,
    path + 'pz' + format, path + 'nz' + format
  ];

  var textureCube = THREE.ImageUtils.loadTextureCube(urls, new THREE.CubeRefractionMapping());
  var material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    envMap: textureCube,
    refractionRatio: 0.95
  });

  // Skybox

  var shader = THREE.ShaderLib["cube"];
  shader.uniforms["tCube"].value = textureCube;

  var material = new THREE.ShaderMaterial({

    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false,
    side: THREE.BackSide

  }), mesh = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), material);
  skyscene.add(mesh);

  // Render the scene
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(MYENV.width, MYENV.height);

  // Add canvas to the DOM
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.autoClear = false;
  document.getElementById('container').appendChild(renderer.domElement);

}

function buildScene() {

  // Build the floor
  var cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(r = 100, r, 10, 50, 10),
    new THREE.MeshLambertMaterial({
      color: MYENV.scene.floorColor
    })
  );
  cylinder.position.y = -35;
  scene.add(cylinder);

  // Build the pendulum
  pPivot = new THREE.Mesh(
    new THREE.SphereGeometry(5, 8, 8),
    new THREE.MeshLambertMaterial({
      color: MYENV.scene.pendulumColor
    })
  );
  pPivot.position.y = MYENV.pendulum.length;
  scene.add(pPivot);

  // Add a sphere
  pBob = new THREE.Mesh(
    new THREE.SphereGeometry(20, 16, 16),
    new THREE.MeshLambertMaterial({
      color: MYENV.scene.pendulumColor
    })
  );
  scene.add(pBob);

  // Add the lighting
  var directionalLight1 = new THREE.DirectionalLight(MYENV.lightColor, 0.7);
  directionalLight1.position.set(0.5, 1, 0.5);
  scene.add(directionalLight1);
  var directionalLight2 = new THREE.DirectionalLight(MYENV.lightColor, 0.5);
  directionalLight2.position.set(-0.5, -1, -0.5);
  scene.add(directionalLight2);
}

function animate() {
  if (isAnimating) requestAnimationFrame(animate);
  render();
}

function render() {

  // Swing the pendulum
  var timeElapsed = clock.getElapsedTime();
  var timeDelta = clock.getDelta();
  var T = Math.sqrt(MYENV.pendulum.length / (980));
  var theta = THREE.Math.degToRad(10) * Math.cos(timeElapsed / T);
  pBob.position.x = MYENV.pendulum.length * Math.sin(theta);
  pBob.position.y = MYENV.pendulum.length - (MYENV.pendulum.length * Math.cos(theta));

  var rotRate = MYENV.pendulum.rotRateEarth * Math.cos(MYENV.pendulum.latitude);

  camera.lookAt(scene.position);
  skycamera.rotation.copy(camera.rotation);

  renderer.render(skyscene, skycamera);
  renderer.render(scene, camera);
}

$(document).ready(function() {
  init();
  animate();
});