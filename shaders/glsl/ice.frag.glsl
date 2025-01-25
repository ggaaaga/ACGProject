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
            randomOffset = offset + 0.3 * sin(iTime * 0.1 + 6.2831 * randomOffset + position);
            
            float distance = length(gridOffset - localPosition + randomOffset);
            float smoothValue = smoothstep(-1.0, 1.0, (minDistance - distance) / width);
            
            minDistance = mix(minDistance, distance, smoothValue) - 
                          smoothValue * (1.0 - smoothValue) * width / (1.0 + 3.0 * width);
        }
    }
    return minDistance;
}

void main() {
    vec2 normalizedUV = (vUv * 2.0 - 1.0);
    vec4 outputColor = vec4(0.0);

    // Adjust and animate UV coordinates
    normalizedUV *= 6.0; 
    normalizedUV.x += iTime * 0.05;
    normalizedUV.y += iTime * 0.05;

    float zoomFactor = 0.3;
    normalizedUV *= zoomFactor;

    // Define colors
    vec4 baseColor = vec4(0.8, 0.9137, 0.9725, 1.0);
    vec4 highlightColor = vec4(1.0, 1.0, 1.0, 1.0);
    vec4 shadowColor = baseColor * 0.8;

    // Compute Voronoi noise values
    float smallDetailNoise = computeVoronoi(normalizedUV, 0.01, 0.3);
    float largeDetailNoise = computeVoronoi(normalizedUV, 0.5, 0.5);
    float combinedVoronoi = smoothstep(0.0, 0.02, smallDetailNoise - largeDetailNoise);

    // Add a subtle frosted blur effect
    float frostPattern = sin(6.2831 * (normalizedUV.x + normalizedUV.y));
    frostPattern = smoothstep(0.4, 0.6, frostPattern) * 0.5;

    // Blend background colors
    vec4 backgroundColor = mix(baseColor, shadowColor, frostPattern);
    vec4 blendedBackgroundColor = mix(backgroundColor, highlightColor, combinedVoronoi + frostPattern);

    // Compute final color
    vec4 finalColor = vec4(mix(blendedBackgroundColor, highlightColor, combinedVoronoi * 0.6));
    gl_FragColor = finalColor;
}
