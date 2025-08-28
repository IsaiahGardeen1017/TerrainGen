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
        noiseOut = octaveNoise(8, vec2((coords.x)+(iTime*timeFactor), (coords.y)));
    }else{
        noiseOut = octaveNoiseTest(8, vec2((coords.x)+(iTime*timeFactor), (coords.y)), xLoc);
    }
    
    
    
    vec3 col;
        if(noiseOut > 0.0){
            col = mixLand(noiseOut);
        }else{
            col = mixOcean(noiseOut);
        }

    
    
    
    fragColor = vec4(vec3(col), 1.0);
}