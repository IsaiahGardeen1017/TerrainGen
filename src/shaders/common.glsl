//*******************************COMMON*******************************


vec2 normalizeCoords(vec2 fragCoord){
    float x = ((fragCoord.x / iResolution.y) + (iTime * timeFactor)) * scaleFactor;
    float y = (fragCoord.y / iResolution.y) * scaleFactor;
    return vec2(x,y);
}

float normalizePerlinNoise(float fl){
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

uint hash(uvec2 x, uint seed) {
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
            return vec2(1.0f, 1.0f);
        case 1:
            return vec2(-1.0f, 1.0f);
        case 2:
            return vec2(1.0f, -1.0f);
        case 3:
            return vec2(-1.0f, -1.0f);
    }
}

float interpolate(float value1, float value2, float value3, float value4, vec2 t) {
    return mix(mix(value1, value2, t.x), mix(value3, value4, t.x), t.y);
}

vec2 fade(vec2 t) {
    // 6t^5 - 15t^4 + 10t^3
    return t * t * t * (t * (t * 6.0f - 15.0f) + 10.0f);
}

float perlinNoise(vec2 position, uint seed) {
    vec2 floorPosition = floor(position);
    vec2 fractPosition = position - floorPosition;
    uvec2 cellCoordinates = uvec2(floorPosition);
    float value1 = dot(gradientDirection(hash(cellCoordinates, seed)), fractPosition);
    float value2 = dot(gradientDirection(hash((cellCoordinates + uvec2(1, 0)), seed)), fractPosition - vec2(1.0f, 0.0f));
    float value3 = dot(gradientDirection(hash((cellCoordinates + uvec2(0, 1)), seed)), fractPosition - vec2(0.0f, 1.0f));
    float value4 = dot(gradientDirection(hash((cellCoordinates + uvec2(1, 1)), seed)), fractPosition - vec2(1.0f, 1.0f));
    return interpolate(value1, value2, value3, value4, fade(fractPosition));
}

float noise(vec2 position) {
    return perlinNoise(position, 1u);
}

//***^^^^^^^^^^^^^^^^^^^^^^^^^^^^COMMON^^^^^^^^^^^^^^^^^^^^^^^^^^^^***