// sunAndMoon.js

import * as THREE from 'three';

export function createSunAndMoon(scene, sunLight, moonLight, ambientLight, lanternLight,lanternSphere, radius) {
  let sunMoonTime = 0;
  const cycleDuration = 500; // Duration of the full cycle (adjust for speed)

  function updateSunAndMoon() {
    sunMoonTime += 0.008; // Control the speed of the sun-moon cycle

    const sunX = radius * Math.cos(sunMoonTime);
    const sunZ = radius * Math.sin(sunMoonTime);
    const moonX = radius * Math.cos(sunMoonTime + Math.PI); // Opposite to the sun
    const moonZ = radius * Math.sin(sunMoonTime + Math.PI);

    sunLight.position.set(sunX, radius * 0.5 * Math.sin(sunMoonTime), sunZ);
    moonLight.position.set(moonX, radius * 0.5 * Math.sin(sunMoonTime + Math.PI), moonZ);

    // Gradually change intensities for day-night transition
    const intensity = Math.max(0, Math.sin(sunMoonTime)); // Sun is brightest at midday
    sunLight.intensity = intensity * 2; // Bright during the day
    moonLight.intensity = Math.max(0, -Math.sin(sunMoonTime)) * 0.5; // Dimmer moonlight

    // Change ambient light and background color for day-night transition
    const colorFactor = (Math.sin(sunMoonTime) + 1) / 2; // Scales between 0 (night) and 1 (day)
    scene.background = new THREE.Color().lerpColors(
      new THREE.Color(0x000022), // Night sky (dark blue)
      new THREE.Color(0x87CEEB), // Daytime sky (light blue)
      colorFactor
    );
    ambientLight.intensity = 0.5 + 0.5 * colorFactor; // Softer light at night

    // Lantern light turns on at night (moon cycle) and off during the day
    lanternLight.intensity = Math.max(0, -Math.sin(sunMoonTime)) * 50; // Bright when the moon is visible

    // Lantern sphere visibility gradually changes with the lantern light
    lanternSphere.visible = lanternLight.intensity > 0;

  }

  return { updateSunAndMoon, sunMoonTime };
}