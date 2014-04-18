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
  }
}

// Global variables
var scene, camera, renderer;
var pendulumBob;
var clock = new THREE.Clock(true);
var isAnimating = true;

function init() {
  scene = new THREE.Scene();

  // Set up the camera
  camera = new THREE.PerspectiveCamera(60, MYENV.aspect, 1, 10000); // FOV, Aspect, Near, Far
  camera.position.y = 25;
  camera.position.z = 300;
  scene.add(camera);

  // Set up the scene
  buildScene();

  // Render the scene
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(MYENV.width, MYENV.height);

  // Add canvas to the DOM
  renderer.domElement.style.backgroundColor = MYENV.scene.bgColor;
  renderer.setClearColor(MYENV.scene.bgColor);
  document.getElementById('container').appendChild(renderer.domElement);

}

function buildScene() {

  // Build the floor
  var cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(100, 100, 10, 50, 10, false),
    new THREE.MeshLambertMaterial({
      color: MYENV.scene.floorColor
    })
  );
  cylinder.position.y = -35;
  scene.add(cylinder);

  // Add a sphere
  pendulumBob = new THREE.Mesh(
    new THREE.SphereGeometry(20, 16, 16),
    new THREE.MeshLambertMaterial({
      color: MYENV.scene.pendulumColor
    })
  );
  scene.add(pendulumBob);


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
  var timeDelta = clock.getElapsedTime();
  pendulumBob.position.x = 100 * Math.cos(timeDelta);

  renderer.render(scene, camera);
}

$(document).ready(function() {
  init();
  animate();
});
