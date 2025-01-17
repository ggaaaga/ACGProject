uniform float iTime;
varying vec2 vUv;

float hash1(float n) { return fract(sin(n) * 43758.5453); }
vec2 hash2(vec2 p) { p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }

float voronoi(vec2 x, float w, float offset) {
  vec2 n = floor(x);
  vec2 f = fract(x);
  float m = 8.0;
  for (int j = -2; j <= 2; j++) {
    for (int i = -2; i <= 2; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash2(n + g);
      o = offset + 0.3 * sin(iTime + 6.2831 * o + x);
      float d = length(g - f + o);
      float h = smoothstep(-1.0, 1.0, (m - d) / w);
      m = mix(m, d, h) - h * (1.0 - h) * w / (1.0 + 3.0 * w); 
    }
  }
  return m;
}

void main() {
  vec2 uv = (vUv * 2.0 - 1.0); // Normalize the canvas from -1 to 1
  vec4 color = vec4(0.0);

  uv = uv * 10.0;
  uv.x += iTime * 0.5;
  uv.y += iTime * 0.25;

  float zoomFactor = 0.5;
  uv *= zoomFactor;

  vec4 a = vec4(0.114, 0.635, 0.847, 1.0); // Base color
  vec4 b = vec4(1.000, 1.000, 1.000, 1.0); // Secondary color
  vec4 c = a * 0.8; // Darken base color for contrast

  float vNoise = voronoi(uv, 0.001, 0.5);
  float sNoise = voronoi(uv, 0.4, 0.5);
  float fVoronoi = smoothstep(0.0, 0.01, vNoise - sNoise);

  float pi = 3.14159265359;
  float wave = sin(pi * (uv.x + uv.y));
  wave = (wave + 1.0) / 2.0; // Scale to 0-1 range

  vec4 bgColor = mix(a, c, wave);
  vec4 bgColor2 = mix(a, c, fVoronoi + wave);

  vec4 finalVoronoi = vec4(mix(bgColor2, b, fVoronoi));
  gl_FragColor = finalVoronoi;
}