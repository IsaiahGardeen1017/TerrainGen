void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 v = normalizeCoords(fragCoord);
    float pNoise = perlinNoise(v, 0u);
    fragColor = vec4(-1.0 * pNoise, pNoise, 0.0, 1.0);
}