void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 v = normalizeCoords(fragCoord);
    float pNoise = perlinNoise(v, 0u);
    float nPnoise = normalizePerlinNoise(pNoise);
    fragColor = vec4(nPnoise, nPnoise, nPnoise, 1.0);
}