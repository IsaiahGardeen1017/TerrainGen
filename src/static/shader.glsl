#ifdef GL_ES
precision mediump float;
#endif

// ShaderToy uniforms
uniform float iTime; // The elapsed time in seconds
uniform vec2 iResolution; // The viewport resolution (width, height)

//Sliders and inputs
uniform float timeFactor; // Our custom uniform for the slider



// ****************** COMMON ******************



// implementation of MurmurHash (https://sites.google.com/site/murmurhash/) for a 
// single unsigned integer.

uint hash(uint x, uint seed) {
    const uint m = 0x5bd1e995U;
    uint hash = seed;
    // process input
    uint k = x;
    k *= m;
    k ^= k >> 24;
    k *= m;
    hash *= m;
    hash ^= k;
    // some final mixing
    hash ^= hash >> 13;
    hash *= m;
    hash ^= hash >> 15;
    return hash;
}

// implementation of MurmurHash (https://sites.google.com/site/murmurhash/) for a  
// 2-dimensional unsigned integer input vector.

uint hash(uvec2 x, uint seed){
    const uint m = 0x5bd1e995U;
    uint hash = seed;
    // process first vector element
    uint k = x.x; 
    k *= m;
    k ^= k >> 24;
    k *= m;
    hash *= m;
    hash ^= k;
    // process second vector element
    k = x.y; 
    k *= m;
    k ^= k >> 24;
    k *= m;
    hash *= m;
    hash ^= k;
	// some final mixing
    hash ^= hash >> 13;
    hash *= m;
    hash ^= hash >> 15;
    return hash;
}


vec2 gradientDirection(uint hash) {
    switch (int(hash) & 3) { // look at the last two bits to pick a gradient direction
    case 0:
        return vec2(1.0, 1.0);
    case 1:
        return vec2(-1.0, 1.0);
    case 2:
        return vec2(1.0, -1.0);
    case 3:
        return vec2(-1.0, -1.0);
    }
}

float interpolate(float value1, float value2, float value3, float value4, vec2 t) {
    return mix(mix(value1, value2, t.x), mix(value3, value4, t.x), t.y);
}

vec2 fade(vec2 t) {
    // 6t^5 - 15t^4 + 10t^3
	return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float perlinNoise(vec2 position, uint seed) {
    vec2 floorPosition = floor(position);
    vec2 fractPosition = position - floorPosition;
    uvec2 cellCoordinates = uvec2(floorPosition);
    float value1 = dot(gradientDirection(hash(cellCoordinates, seed)), fractPosition);
    float value2 = dot(gradientDirection(hash((cellCoordinates + uvec2(1, 0)), seed)), fractPosition - vec2(1.0, 0.0));
    float value3 = dot(gradientDirection(hash((cellCoordinates + uvec2(0, 1)), seed)), fractPosition - vec2(0.0, 1.0));
    float value4 = dot(gradientDirection(hash((cellCoordinates + uvec2(1, 1)), seed)), fractPosition - vec2(1.0, 1.0));
    return interpolate(value1, value2, value3, value4, fade(fractPosition));
}

float noise(vec2 position) {
    return perlinNoise(position, 1u);
}


// ****************









float n255(float a){
    return (a - 0.0) / 255.0;
}

vec3 mixOcean(float a){
    vec3 collo = vec3(n255(21.0),n255(235.0),n255(230.0));
    vec3 colhi = vec3(n255(9.0),n255(56.0),n255(95.0));
    return mix(collo, colhi, 0.0 - a);
}

vec3 mixLand(float a){
    vec3 collo = vec3(n255(0.0),n255(169.0),n255(14.0));
    vec3 colhi = vec3(n255(127.0),n255(196.0),n255(110.0));
    return mix(collo, colhi, a);
}


float octaveNoise(int octaves, vec2 coords){
        float value = 0.0;
        float amplitude = 1.0;
        float persistence = 0.5;
        float lacunarity = 2.0;
        float currentFrequency = 1.0;
        for (int i = 0; i < octaves; i++) {
            value += noise(coords * currentFrequency) * amplitude;
            amplitude *= persistence;
            currentFrequency *= lacunarity;
        }
        return value;
}

float octaveNoiseTest(int octaves, vec2 coords, float xLoc){
        float value = 0.0;
        float amplitude = 1.0;
        float persistence = 0.5 + (xLoc * 0.25);
        float lacunarity = 2.00;
        float currentFrequency = 1.0;
        for (int i = 0; i < octaves; i++) {
            value += noise(coords * currentFrequency) * amplitude;
            amplitude *= persistence;
            currentFrequency *= lacunarity;
        }
        return value;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float xLoc = fragCoord.x/iResolution.x;
    
    float aspectRatio = iResolution.x/iResolution.y;
    vec2 norm = fragCoord/iResolution.xy;
    vec2 coords = norm; //vec2(fragCoord.x*aspectRatio, fragCoord.y);

    
    
    float noiseOut;
    if(fragCoord.y < 0.5*iResolution.y){
        noiseOut = octaveNoise(8, vec2((coords.x)+iTime, (coords.y)));
    }else{
        noiseOut = octaveNoiseTest(8, vec2((coords.x)+iTime, (coords.y)), xLoc);
    }
    
    
    
    vec3 col;
        if(noiseOut > 0.0){
            col = mixLand(noiseOut);
        }else{
            col = mixOcean(noiseOut);
        }

    
    
    
    fragColor = vec4(vec3(col), 1.0);
}

