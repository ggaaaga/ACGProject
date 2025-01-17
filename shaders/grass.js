import * as THREE from 'three';

export function createGrassTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2000;
    canvas.height = 2000;
    const context = canvas.getContext('2d');
    context.fillStyle = 'rgb(14, 97, 47)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const colors = ['rgb(41, 167, 44)', 'rgb(27, 142, 85)', 'rgb(27, 152, 46)', 'rgb(28, 139, 83)'];
    const triangleSize = 10;
    const triangles = [];

    function isOverlapping(x, y) {
        for (const triangle of triangles) {
            const dx = triangle.x - x;
            const dy = triangle.y - y;
            if (Math.sqrt(dx * dx + dy * dy) < triangleSize) {
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

        triangles.push({ x, y });

        context.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        context.save();
        context.translate(x, y);
        context.rotate(Math.random() * 2 * Math.PI);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(triangleSize, 0);
        context.lineTo(triangleSize / 2, -triangleSize);
        context.closePath();
        context.fill();
        context.restore();
    }
    return new THREE.CanvasTexture(canvas);
}
