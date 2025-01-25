import * as THREE from 'three';

export function createWinterGrassTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2000;
    canvas.height = 2000;
    const context = canvas.getContext('2d');
    context.fillStyle = 'rgb(255, 255, 255)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const colors = ['rgb(123, 196, 245)', 'rgb(3, 251, 255)', 'rgb(211, 193, 250)', 'rgb(222, 255, 239)'];
    const pointSize = 6;
    const points = [];

    function isOverlapping(x, y) {
        for (const point of points) {
            const dx = point.x - x;
            const dy = point.y - y;
            if (Math.sqrt(dx * dx + dy * dy) < pointSize) {
                return true;
            }
        }
        return false;
    }

    for (let i = 0; i < 20000; i++) {
        let x, y;
        do {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        } while (isOverlapping(x, y));

        points.push({ x, y });

        context.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        context.beginPath();
        context.arc(x, y, pointSize / 2, 0, 2 * Math.PI);
        context.fill();
    }
    //return it as toon texture
    return new THREE.CanvasTexture(canvas);
}
