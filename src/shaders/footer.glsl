//*******************************FOOTER*******************************
// THIS IS THE NEW WEBGLL 2.0 ENTRY POINT WRAPPER
void main() {
    // Declare the local variables that mainImage expects
    vec4 fragColor;
    vec2 fragCoord = gl_FragCoord.xy; // gl_FragCoord.xy is built-in in GLSL ES 3.00

    // Call your ShaderToy-compliant mainImage function
    mainImage(fragColor, fragCoord);

    // Assign the result from mainImage to the actual WebGL2 output variable
    fragColorOutput = fragColor;
}
//***^^^^^^^^^^^^^^^^^^^^^^^^^^^^FOOTER^^^^^^^^^^^^^^^^^^^^^^^^^^^^***