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
  unitsize: 250,
  player: {
    speed: 100,
    rotation: 0.5,
    height: 50
  },
  scene: {
    fogColor: 0xD6F1FF,
    skyColor: '#D6F1FF',
    floorColor: 0xEDCBA0,
    cubeColor: 0xC5EDA0,
    lightColor: 0xF7EFBE
  }
}

// Global variables
var scene, camera, renderer;
var isAnimating = true;

function init() {
  scene = new THREE.Scene();

  // Set up the camera
  camera = new THREE.PerspectiveCamera(60, MYENV.aspect, 1, 10000); // FOV, Aspect, Near, Far
  camera.position.y = MYENV.player.height;
  camera.position.z = 250;
  scene.add(camera);

  // Set up the scene
  buildScene();

  // Render the scene
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(MYENV.width, MYENV.height);

  // Add canvas to the DOM
  renderer.domElement.style.backgroundColor = MYENV.scene.skyColor;
  renderer.setClearColor(MYENV.scene.skyColor);
  document.getElementById('container').appendChild(renderer.domElement);

}

function buildScene() {

  // Build the floor
  // var floor = new THREE.Mesh(
  //   new THREE.CubeGeometry(10 * MYENV.unitsize, 10, 10 * MYENV.unitsize),
  //   new THREE.MeshLambertMaterial({
  //     color: 0xEDCBA0
  //   })
  // );
  // scene.add(floor);

  var cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(100, 100, 10, 50, 10, false),
    new THREE.MeshLambertMaterial({
      color: 0xEDCBA0
    })
  );
  scene.add(cylinder);

  // Add some cubes
  var cubeG = new THREE.CubeGeometry(MYENV.unitsize * 0.3, MYENV.unitsize * 0.3,
    MYENV.unitsize * 0.3);
  var cubeM = new THREE.MeshLambertMaterial({
    color: MYENV.scene.cubeColor
  });
  var cube = new THREE.Mesh(cubeG, cubeM);
  cube.position.set(MYENV.unitsize, (MYENV.unitsize * 0.3) / 2, MYENV.unitsize);
  scene.add(cube);

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
  renderer.render(scene, camera);
}

$(document).ready(function() {
  init();
  animate();
});
