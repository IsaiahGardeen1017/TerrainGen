void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 v = normalizeCoords(fragCoord);
    uvec2 u = uvec2(v);
    float hashedValue = float(hash2(u, 0u)) / 4294967295.0;
    fragColor = vec4(hashedValue, hashedValue, hashedValue, 1.0);
}