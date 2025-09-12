void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 v = normalizeCoords(fragCoord);
    float pNoise = perlinNoise(v, 0u);
    float nPnoise = normalizePerlinNoise(pNoise);
    vec3 color = mapPerlinToColor(nPnoise);
    fragColor = vec4(color, 1.0);
}