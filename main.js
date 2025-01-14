import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();

// Set the background color of the scene
scene.background = new THREE.Color(0xfdfc);

// Create a camera
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 300, 600); 

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Add lighting
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(hemiLight);

// OrbitControls: enable mouse interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.05;
controls.target.set(0, 1, 0); 

// Variables for auto-rotation
let isAutoRotating = false; 
let model;

// Load the .glb file
const loader = new GLTFLoader();
loader.load(
  '/untitled.glb',
  (gltf) => {
    model = gltf.scene;
    scene.add(model);
    model.position.set(0, 0, 0); 
    model.rotation.set(0, 0, 0);
  },
  undefined,
  (error) => {
    console.error('An error occurred while loading the .glb file:', error);
  }
);

// Add a click event listener to toggle auto-rotation
window.addEventListener('click', () => {
  isAutoRotating = !isAutoRotating;
});

// Animation for roatation
function animate() {
  requestAnimationFrame(animate);
  // If auto-rotation is enabled, rotate the model
  if (isAutoRotating && model) {
    model.rotation.y += 0.01;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
