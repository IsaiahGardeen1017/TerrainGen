void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 v = normalizeCoords(fragCoord);
    uvec2 u = uvec2(v);
    float hashedValue = float(hash(u, 0u)) / 4294967295.0f;
    fragColor = vec4(hashedValue, hashedValue, hashedValue, 1.0);
}