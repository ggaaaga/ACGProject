import * as THREE from 'three';

// Helper function to load GLSL files as text
async function loadShader(url) {
  const response = await fetch(url);
  return await response.text();
}

// Function to create the water shader material
export async function createWaterMaterial() {
  const vertexShader = await loadShader('./shaders/glsl/water.vert.glsl');
  const fragmentShader = await loadShader('./shaders/glsl/water.frag.glsl');

  return new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  });
}