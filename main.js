// Imports
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createWaterMaterial } from './shaders/water.js';
import { createSunAndMoon } from './sunAndMoon.js'; 
import { createGrassTexture } from './shaders/grass.js';
import { createIceMaterial } from './shaders/ice.js';
import { createWinterGrassTexture } from './shaders/winterGrass.js';
import { createSnow } from './shaders/snow.js';

// Global variables
let waterTime = 0;
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
let useIceShader = false;

// Background
scene.background = new THREE.Color(0x87CEEB); 

// Camera Setup
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(1, 7, -15);

// Rendering Setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.shadowMap.enabled = true; // Enable shadows in the renderer
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: Softer shadows
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

//create event listener for button
const toggleShaderButton = document.getElementById('toggleShaderButton');
toggleShaderButton.addEventListener('click', () => {
  useIceShader = !useIceShader; // Toggle the shader state
  toggleShaderButton.textContent = useIceShader ? 'Switch to Water Shader' : 'Switch to Ice Shader';
});


//----------------------LIGHTS----------------------//
// Sun
const sunLight = new THREE.DirectionalLight(0xffffff, 2);
sunLight.position.set(5, 10, 5);
sunLight.castShadow = true;
scene.add(sunLight);

// Moon
const moonLight = new THREE.DirectionalLight(0x8888ff, 1); 
moonLight.position.set(5, 10, 5);
moonLight.castShadow = true;
scene.add(moonLight);

// Ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 3); +
scene.add(ambientLight);

// Hemisphere light
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.1); 
scene.add(hemiLight);

// Lantern light
const lanternLight = new THREE.PointLight(0xffa500, 0, 100); 
lanternLight.position.set(0, 3.5, 0);
lanternLight.castShadow = true;
scene.add(lanternLight);

// Lanter Light circular object
const lanternGeometry = new THREE.SphereGeometry(0.32, 32, 32);
const lanternMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 });
const lanternSphere = new THREE.Mesh(lanternGeometry, lanternMaterial);
lanternSphere.position.set(0, 3.5, 0);
scene.add(lanternSphere);

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

// Configure Lantern shadow properties
lanternLight.shadow.bias = -0.001;
lanternLight.shadow.mapSize.width = 2048;
lanternLight.shadow.mapSize.height = 2048;


//----------------------CONTROLS----------------------//
// OrbitControls for mouse interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;


//----------------------MATERIALS----------------------//
// Get the grass texture
const grassTexture = await createGrassTexture(); 

// Get water material
const waterMaterial = await createWaterMaterial();

//Get Ice Material
const iceMaterial = await createIceMaterial();

// Get winter grass texture
const winterGrassTexture = await createWinterGrassTexture();

// Create snow
const snow = createSnow(scene);

//test dark blue texture
const darkBlueTexture = new THREE.TextureLoader().load('/darkBlue.jpg');


//----------------------MODEL----------------------//
// Load the .glb model
const loader = new GLTFLoader();
let model;

loader.load('/Floating_Island.glb', async (gltf) => {
  model = gltf.scene;
  scene.add(model);
  
  model.position.set(0, 0, 0);
  model.rotation.set(0, 0, 0);

  model.traverse((child) => {
    console.log(child.name);
    // Island
    if (child.isMesh && child.name === 'Vert001') {
      child.material.map = grassTexture;
      child.material.needsUpdate = true;
    } 
    // Pond
    else if (child.isMesh && child.name === '柱体') {
      child.material = waterMaterial;
      child.material.needsUpdate = true; 
    }
  });
}, undefined, (error) => {
  console.error('An error occurred while loading the .glb file:', error);
});


//----------------------SUN AND MOON LOGIC----------------------//
// Call the sun and moon logic
const { updateSunAndMoon } = createSunAndMoon(scene, sunLight, moonLight, ambientLight, lanternLight, lanternSphere, 30);


//----------------------RENDERING----------------------//
function animate() {
  requestAnimationFrame(animate);

  // Update sun and moon positions
  updateSunAndMoon();
  
  // Animate snow
  snow.animateSnow();

  // Update snows visibility if button is pressed (aka useIceShader is true)
  if (useIceShader) {
    snow.showSnow();
  } else { 
    snow.hideSnow();
  }

  // Update water shader's iTime uniform
  if (model) {
    model.traverse((child) => {
      //enable cast shadow
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.isMesh && child.name === '柱体') {
        const deltaTime = performance.now() * 0.001;
        child.material.uniforms.iTime.value = deltaTime;

        //Check state of button and turn on ice shader
        child.material = useIceShader ? iceMaterial : waterMaterial;
      }
      else if (child.isMesh && child.name === 'Vert001') {
        child.material.map = useIceShader ? winterGrassTexture : grassTexture;
        child.material.needsUpdate = true;
      }
    });
  }

  // Update controls and render the scene
  controls.update();
  renderer.render(scene, camera);
}

animate();
