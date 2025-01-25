import * as THREE from 'three';

// Helper function to load GLSL files as text
async function loadShader(url) {
  const response = await fetch(url);
  return await response.text();
}

// Function to create the ice shader material
export async function createIceMaterial() {
  const vertexShader = await loadShader('./shaders/glsl/ice.vert.glsl');
  const fragmentShader = await loadShader('./shaders/glsl/ice.frag.glsl');

  return new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  });
}