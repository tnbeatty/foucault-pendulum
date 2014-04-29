/**
 * main.js
 *
 * @overview A work in progress - demonstration of the Foucault Pendulum.
 *
 * @author Nate Beatty | {@link http://natebeatty.com|tnbeatty}
 * @copyright All Rights Reserved - 2014
 *
 */

if (!Detector.webgl) Detector.addGetWebGLMessage();

var MYENV = { // The variables that define the environment
  scene: {
    bgColor: '#D6F1FF',
    floorColor: 0xEDCBA0,
    pendulumColor: 0x8000FF,
    pivotColor: 0x000000,
    lightColor: 0xF7EFBE
  },
  pendulum: {
    length: 500,
    initialFloorRotation: 3 * Math.PI / 2,
    startAngle: 15, // degrees
    rotRateEarth: 360.0, // degrees per day
    latitude: 90 // latitude of the pendulum on the earth (degrees above equator)
  }
}

// Global variables
var scene, skyscene, camera, skycamera, renderer;
var pBob, pCable, pPivot, compassFloor;
var startRotation;
var windowWidth = window.innerWidth,
  windowHeight = window.innerHeight,
  windowAspect = window.innerWidth / window.innerHeight,
  windowHalfX = window.innerWidth / 2,
  windowHalfY = window.innerHeight / 2;
var mouseX = 0,
  mouseY = 0;
var clock = new THREE.Clock(true);
var isAnimating = true;

function init() {
  scene = new THREE.Scene();
  skyscene = new THREE.Scene();

  // Set up the camera
  camera = new THREE.PerspectiveCamera(60, windowAspect, 1, 100000); // FOV, Aspect, Near, Far
  camera.position.y = 200;
  camera.position.z = 700;
  scene.add(camera);

  skycamera = new THREE.PerspectiveCamera(60, windowAspect, 1, 100000);

  // Set up the scene
  buildScene();
  buildSkybox();

  resetCompassOrientation();

  // Render the scene
  renderer = new THREE.WebGLRenderer({
    antialiasing: true
  });
  renderer.setSize(windowWidth, windowHeight);
  renderer.autoClear = false;
  document.getElementById('container').appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
}

function buildScene() {

  // Build the floor
  var compassTexture_top = THREE.ImageUtils.loadTexture(
    "assets/textures/compassrose_top.png");
  var compassTexture_bottom = THREE.ImageUtils.loadTexture(
    "assets/textures/compassrose_bottom.png");
  compassFloor = new THREE.CoinGeometry(250.0, 10.0, 100.0, 10.0,
    compassTexture_top, compassTexture_bottom, MYENV.scene.floorColor);
  compassFloor.position.y = -35;
  compassFloor.rotation.y = MYENV.pendulum.initialFloorRotation;
  scene.add(compassFloor);

  // Build the pendulum

  // Add the pivot
  pPivot = new THREE.Mesh(
    new THREE.SphereGeometry(5, 8, 8),
    new THREE.MeshLambertMaterial({
      color: MYENV.scene.pivotColor
    })
  );
  pPivot.position.y = MYENV.pendulum.length;
  scene.add(pPivot);

  // Add the cable
  pCableGeometry = new THREE.Geometry();
  pCableGeometry.vertices.push(new THREE.Vector3(0, pPivot.position.y, 0));
  pCableGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
  pCable = new THREE.Line(pCableGeometry,
    new THREE.LineBasicMaterial({
      color: 0xffffff
    })
  );
  // scene.add(pCable);

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

function resetCompassOrientation() {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var delta = ((new Date()) - today) / 1000; // Time delta in sec
  // delta = 6*60*60;
  startRotation = (MYENV.pendulum.initialFloorRotation + (floorRotationRate() *
    delta));
  compassFloor.rotation.y = startRotation;
}

function buildSkybox() {
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

  var shader = THREE.ShaderLib["cube"];
  shader.uniforms["tCube"].value = textureCube;

  var material = new THREE.ShaderMaterial({

    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false,
    side: THREE.BackSide

  }),
    mesh = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), material);
  skyscene.add(mesh);
}

/** EVENT LISTENERS **/

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  skycamera.aspect = window.innerWidth / window.innerHeight;
  skycamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {

  mouseX = (event.clientX - windowHalfX) * 4;
  mouseY = (event.clientY - windowHalfY) * 4;

}

/** DRAWING **/

function animate() {
  if (isAnimating) requestAnimationFrame(animate);
  render();
}

function render() {

  // Swing the pendulum
  var timeElapsed = clock.getElapsedTime();
  // var timeDelta = clock.getDelta() / 1000;
  var T = Math.sqrt(MYENV.pendulum.length / (980));
  var theta = THREE.Math.degToRad(MYENV.pendulum.startAngle) * Math.cos(
    timeElapsed / T);
  pBob.position.x = MYENV.pendulum.length * Math.sin(theta);
  pBob.position.y = MYENV.pendulum.length - (MYENV.pendulum.length * Math.cos(
    theta));
  pCable.geometry.vertices[1] = pBob.position;
  pCable.geometry.verticesNeedUpdate = true;

  // Rotate the floor appropriately
  var rotationAddition = floorRotationRate() * timeElapsed;
  compassFloor.rotation.y = startRotation + rotationAddition;

  // Track the camera position via mouse input
  camera.position.x += (mouseX - camera.position.x) * .05;
  camera.position.y += (-mouseY - camera.position.y) * .05;
  camera.lookAt(scene.position);
  skycamera.rotation.copy(camera.rotation);

  renderer.render(skyscene, skycamera);
  renderer.render(scene, camera);
}

var floorRotationRate = function() { // Rotation rate in rad per second (based on latitude)
  var degPerSec = MYENV.pendulum.rotRateEarth / (24.0 * 60.0 * 60.0);
  return (THREE.Math.degToRad(degPerSec) * Math.cos(THREE.Math.degToRad(90 -
    MYENV.pendulum.latitude)));
}

$(document).ready(function() {

  document.addEventListener('mousemove', onDocumentMouseMove, false);

  if (Detector.webgl) {
    init();
    animate();
  }

  function resetPosition(latitude) {
    console.log('Resetting lattitude to ' + latitude);
    MYENV.pendulum.latitude = latitude;
    resetCompassOrientation();
  };

  $('#geocomplete').geocomplete({
    map: '.map_canvas'
  })
    .bind("geocode:result", function(event, result) {
      console.log("Result: ");
      console.log(result);
      resetPosition(result.geometry.location.k);
    })
    .bind("geocode:error", function(event, status) {
      console.log("ERROR: " + status);
    })
    .bind("geocode:multiple", function(event, results) {
      console.log("Multiple: " + results.length + " results found");
    });

});

// $(function(){
//   $('#geocomplete').geocomplete();
// });
