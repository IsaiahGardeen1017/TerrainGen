//*******************************COMMON*******************************

vec2 normalizeCoords(vec2 fragCoord) {
    float x = ((fragCoord.x / iResolution.y) + (iTime * timeFactor)) * scaleFactor;
    float y = (fragCoord.y / iResolution.y) * scaleFactor;
    return vec2(x, y);
}

float normalizePerlinNoise(float fl) {
    return (fl + 1.0) / 2.0;
}

//^^new^^
//**old**

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

uint hash2(uvec2 x, uint seed) {
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
    switch(int(hash) & 3) { // look at the last two bits to pick a gradient direction
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
    float value1 = dot(gradientDirection(hash2(cellCoordinates, seed)), fractPosition);
    float value2 = dot(gradientDirection(hash2((cellCoordinates + uvec2(1, 0)), seed)), fractPosition - vec2(1.0, 0.0));
    float value3 = dot(gradientDirection(hash2((cellCoordinates + uvec2(0, 1)), seed)), fractPosition - vec2(0.0, 1.0));
    float value4 = dot(gradientDirection(hash2((cellCoordinates + uvec2(1, 1)), seed)), fractPosition - vec2(1.0, 1.0));
    return interpolate(value1, value2, value3, value4, fade(fractPosition));
}

float noise(vec2 position) {
    return perlinNoise(position, 1u);
}



vec3 mapPerlinToColor(float value) {
    vec3 deepWaterColor = vec3(0.074, 0.258, 0.345);
    vec3 shallowWaterColor = vec3(0.345, 0.714, 0.788);
    vec3 lowGroundColor = vec3(0.118, 0.471, 0.184);
    vec3 highGroundColor = vec3(0.506, 0.624, 0.259);

    if(value < 0.5) {
        // Ocean
        return mix(deepWaterColor, shallowWaterColor, value * 2.0);
    } else {
        // Land
        return mix(lowGroundColor, highGroundColor, (value - 0.5) * 2.0);
    }
}

float perlinOctave(vec2 position, float frequency, float amplitude, uint seed){
    float pl = perlinNoise(position * frequency, seed);
    float npl = (pl + 1.0) / 2.0;
    return npl * amplitude;
}


//***^^^^^^^^^^^^^^^^^^^^^^^^^^^^COMMON^^^^^^^^^^^^^^^^^^^^^^^^^^^^***