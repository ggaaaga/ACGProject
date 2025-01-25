// sunAndMoon.js

import * as THREE from 'three';

export function createSunAndMoon(scene, sunLight, moonLight, ambientLight, lanternLight,lanternSphere, radius) {
  let sunMoonTime = 0;
  const cycleDuration = 500;

  function updateSunAndMoon() {
    sunMoonTime += 0.008;

    const sunX = radius * Math.cos(sunMoonTime);
    const sunZ = radius * Math.sin(sunMoonTime);
    const moonX = radius * Math.cos(sunMoonTime + Math.PI);
    const moonZ = radius * Math.sin(sunMoonTime + Math.PI);

    sunLight.position.set(sunX, radius * 0.8 * Math.sin(sunMoonTime), sunZ);
    moonLight.position.set(moonX, radius * 0.8 * Math.sin(sunMoonTime + Math.PI), moonZ);

    // Gradually change intensities for day-night transition
    const intensity = Math.max(0, Math.sin(sunMoonTime));
    sunLight.intensity = intensity * 1;
    moonLight.intensity = Math.max(0, -Math.sin(sunMoonTime)) * 0.5;

    // Change ambient light and background color for day-night transition
    const colorFactor = (Math.sin(sunMoonTime) + 1) / 2;
    scene.background = new THREE.Color().lerpColors(
      new THREE.Color(0x000022),
      new THREE.Color(0x87CEEB),
      colorFactor
    );
    ambientLight.intensity = 0.5 + 0.5 * colorFactor;

    // Lantern light turns on at night (moon cycle) and off during the day
    lanternLight.intensity = Math.max(0, -Math.sin(sunMoonTime)) * 50;

    // Lantern sphere visibility gradually changes with the lantern light
    lanternSphere.visible = lanternLight.intensity > 0;

    //boolean for if lantern is on or off
    let lanternOn = lanternLight.intensity > 0;
  }

  return { updateSunAndMoon, sunMoonTime};
}