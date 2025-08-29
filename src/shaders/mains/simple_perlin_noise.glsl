void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float pNoise = perlinNoise((fragCoord / 100.0) + iTime, 0u);
    fragColor = vec4(pNoise, pNoise, pNoise, 1.0);
}