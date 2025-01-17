// main.js

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createWaterMaterial } from './shaders/water.js';
import { createSunAndMoon } from './sunAndMoon.js'; // Import the sun and moon module
import { createGrassTexture } from './shaders/grass.js'; // Import the texture function

let waterTime = 0;

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();

// Set initial background color (daytime sky)
scene.background = new THREE.Color(0x87CEEB); // Light blue for daytime

// Create a camera
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(1, 7, -15);

// Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.shadowMap.enabled = true; // Enable shadows in the renderer
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: Softer shadows
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// ----------------------------------
// Add lighting
// Sun
const sunLight = new THREE.DirectionalLight(0xffffff, 2);
sunLight.position.set(5, 10, 5);
sunLight.castShadow = true;
// Add helper to visualize the light source
const sunLightHelper = new THREE.DirectionalLightHelper(sunLight, 1);
//scene.add(sunLightHelper);
scene.add(sunLight);
// Configure Sun shadow properties
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 50;
sunLight.shadow.camera.left = -10;
sunLight.shadow.camera.right = 10;
sunLight.shadow.camera.top = 10;
sunLight.shadow.camera.bottom = -10;
sunLight.shadow.bias = -0.001;

// Moon
const moonLight = new THREE.DirectionalLight(0x8888ff, 1); // Dim bluish light
moonLight.position.set(5, 10, 5);
moonLight.castShadow = true;
moonLight.shadow.bias = -0.001; // Reduce shadow acne
// Add helper to visualize the light source
const moonLightHelper = new THREE.DirectionalLightHelper(moonLight, 1);
//scene.add(moonLightHelper);
scene.add(moonLight);
// Configure Moon shadow properties
moonLight.shadow.mapSize.width = 2048;
moonLight.shadow.mapSize.height = 2048;
moonLight.shadow.camera.near = 0.5;
moonLight.shadow.camera.far = 50;
moonLight.shadow.camera.left = -10;
moonLight.shadow.camera.right = 10;
moonLight.shadow.camera.top = 10;
moonLight.shadow.camera.bottom = -10;
moonLight.shadow.bias = -0.001;

// Ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 3); // Soft neutral light
scene.add(ambientLight);

// Hemisphere light
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.1); // Soft white light
scene.add(hemiLight);

// Lantern light
const lanternLight = new THREE.PointLight(0xffa500, 0, 10); // Orange light
lanternLight.position.set(0, 3.5, 0);
lanternLight.castShadow = true;
lanternLight.shadow.bias = -0.001;
lanternLight.shadow.mapSize.width = 2048;
lanternLight.shadow.mapSize.height = 2048;
scene.add(lanternLight);
// Lanter Light circular object
const lanternGeometry = new THREE.SphereGeometry(0.32, 32, 32);
const lanternMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 });
const lanternSphere = new THREE.Mesh(lanternGeometry, lanternMaterial);
lanternSphere.position.set(0, 3.5, 0);
scene.add(lanternSphere);
const lanternHelper = new THREE.PointLightHelper(lanternLight, 0.5); // Debug light helper
//scene.add(lanternHelper);


// ----------------------------------
// OrbitControls for mouse interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Load the .glb model
const loader = new GLTFLoader();
let model;

// Get the grass texture
const texture = createGrassTexture();  // Use the function from grass.js


loader.load('/Floating_Island.glb', async (gltf) => {
  model = gltf.scene;
  scene.add(model);
  
  model.position.set(0, 0, 0);
  model.rotation.set(0, 0, 0);

  const waterMaterial = await createWaterMaterial();

  model.traverse((child) => {
    console.log(child.name);
    if (child.isMesh && child.name === 'Vert001') {
      if (!child.geometry.attributes.uv) { console.log('No UVs found!'); }
      child.material.map = texture; // Apply the texture to the material
      child.material.needsUpdate = true;
    } 
    else if (child.isMesh && child.name === '柱体') {
      child.material = waterMaterial;
      child.material.needsUpdate = true;
    } else if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}, undefined, (error) => {
  console.error('An error occurred while loading the .glb file:', error);
});

// Call the sun and moon logic
const { updateSunAndMoon } = createSunAndMoon(scene, sunLight, moonLight, ambientLight, lanternLight, lanternSphere, 30);

function animate() {
  requestAnimationFrame(animate);

  // Update sun and moon positions
  updateSunAndMoon();

  // Update water shader's iTime uniform
  if (model) {
    model.traverse((child) => {
      if (child.isMesh && child.name === '柱体') {
        const deltaTime = performance.now() * 0.001;
        child.material.uniforms.iTime.value = deltaTime;
      }
    });
  }

  // Update controls and render the scene
  controls.update();
  renderer.render(scene, camera);
}

animate();
