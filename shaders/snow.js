import * as THREE from 'three';

export function createSnow(scene) {
    // Create a particle system for snow
    const snowflakeGeometry = new THREE.BufferGeometry();
    const snowflakeCount = 1000;

    // Create an array for snowflake positions
    const snowflakePositions = new Float32Array(snowflakeCount * 3); 
    for (let i = 0; i < snowflakeCount; i++) {
        snowflakePositions[i * 3 + 0] = (Math.random() - 0.5) * 50;
        snowflakePositions[i * 3 + 1] = Math.random() * 20 + 10;
        snowflakePositions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }

    // Set snowflake positions to the geometry
    snowflakeGeometry.setAttribute('position', new THREE.BufferAttribute(snowflakePositions, 3));

    // Create a material for the snowflakes
    const snowflakeMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.2,
        transparent: true,
        opacity: 0.8,
    });

    // Create the particle system
    const snowParticles = new THREE.Points(snowflakeGeometry, snowflakeMaterial);
    scene.add(snowParticles);

    // Animation function for snow
    function animateSnow() {
        const positions = snowflakeGeometry.attributes.position.array;

        for (let i = 0; i < snowflakeCount; i++) {
            positions[i * 3 + 1] -= 0.05;

            // Reset snowflake position when it falls below the scene
            if (positions[i * 3 + 1] < 0) {
                positions[i * 3 + 1] = Math.random() * 20 + 10; 
                positions[i * 3 + 0] = (Math.random() - 0.5) * 50;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
            }
        }

        // Mark geometry as needing an update
        snowflakeGeometry.attributes.position.needsUpdate = true;
    }

    // Function to make snow visible
    function showSnow() {
        snowParticles.visible = true;
    }

    // Function to make snow not visible
    function hideSnow() {
        snowParticles.visible = false;
    }

    return {
        animateSnow,
        showSnow,
        hideSnow
    };
}
