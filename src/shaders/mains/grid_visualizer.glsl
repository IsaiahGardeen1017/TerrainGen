void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 v = normalizeCoords(fragCoord);
    fragColor = vec4(v - floor(v), 0.0, 1.0);
}