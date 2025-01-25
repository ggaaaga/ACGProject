uniform float iTime;
varying vec2 vUv;


// Hash function for a single float
float generateHash1(float value) { 
    return fract(sin(value) * 43758.5453); 
}

// Hash function for a 2D vector
vec2 generateHash2(vec2 coordinates) { 
    coordinates = vec2(dot(coordinates, vec2(127.1, 311.7)), dot(coordinates, vec2(269.5, 183.3))); 
    return fract(sin(coordinates) * 43758.5453); 
}

// Voronoi function for texture generation
float computeVoronoi(vec2 position, float width, float offset) {
    vec2 baseCell = floor(position);
    vec2 localPosition = fract(position);
    float minDistance = 10.0;

    for (int yOffset = -2; yOffset <= 2; yOffset++) {
        for (int xOffset = -2; xOffset <= 2; xOffset++) {
            vec2 gridOffset = vec2(float(xOffset), float(yOffset));
            vec2 randomOffset = generateHash2(baseCell + gridOffset);
            randomOffset = offset + 0.3 * sin(iTime + 6.2831 * randomOffset + position);
            
            float distance = length(gridOffset - localPosition + randomOffset);
            float smoothValue = smoothstep(-1.0, 1.0, (minDistance - distance) / width);
            
            minDistance = mix(minDistance, distance, smoothValue) - 
                          smoothValue * (1.0 - smoothValue) * width / (1.0 + 3.0 * width);
        }
    }
    return minDistance;
}

void main() {
    vec2 normalizedUV = (vUv * 2.0 - 1.0); // Map UV to range [-1, 1]
    vec4 outputColor = vec4(0.0);

    // Adjust and animate UV coordinates
    normalizedUV *= 10.0;
    normalizedUV.x += iTime * 0.2;
    normalizedUV.y += iTime * 0.25;

    float zoomFactor = 0.5;
    normalizedUV *= zoomFactor;

    // Define colors
    vec4 baseColor = vec4(0.114, 0.635, 0.847, 1.0); // Primary color
    vec4 highlightColor = vec4(1.000, 1.000, 1.000, 1.0); // Highlight color
    vec4 shadowColor = baseColor * 0.7; // Darkened primary color

    // Compute Voronoi noise values
    float smallDetailNoise = computeVoronoi(normalizedUV, 0.001, 0.5);
    float largeDetailNoise = computeVoronoi(normalizedUV, 0.4, 0.5);
    float combinedVoronoi = smoothstep(0.0, 0.01, smallDetailNoise - largeDetailNoise);

    // Calculate wave pattern
    float pi = 3.14;
    float wavePattern = sin(pi * (normalizedUV.x + normalizedUV.y));
    wavePattern = (wavePattern + 1.0) / 2.0; // Scale wave to [0, 1]

    // Blend background colors
    vec4 backgroundColor = mix(baseColor, shadowColor, wavePattern);
    vec4 blendedBackgroundColor = mix(baseColor, shadowColor, combinedVoronoi + wavePattern);

    // Compute final color
    vec4 finalColor = vec4(mix(blendedBackgroundColor, highlightColor, combinedVoronoi));
    gl_FragColor = finalColor;
}
