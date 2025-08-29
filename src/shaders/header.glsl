#version 300 es

#ifdef GL_ES
precision mediump float;
#endif

out vec4 fragColorOutput;

// ShaderToy uniforms
uniform float iTime; // The elapsed time in seconds
uniform vec2 iResolution; // The viewport resolution (width, height)

//Sliders and inputs
uniform float timeFactor; // Our custom uniform for the slider
uniform float scaleFactor; // Our custom uniform for the slider

//***^^^^^^^^^^^^^^^^^^^^^^^^^^^^HEADER^^^^^^^^^^^^^^^^^^^^^^^^^^^^***