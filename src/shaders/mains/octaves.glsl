void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 v = normalizeCoords(fragCoord);
    
    float octaveR = perlinOctave(v, 1.0, 1.0, 0u);
    float octaveG = perlinOctave(v, 2.0, 1.0, 0u);
    float octaveB = perlinOctave(v, 4.0, 1.0, 0u);
    

    float screenPercentage = fragCoord.x / iResolution.x;

    float alll = (octaveR + octaveR + octaveR) / 3.0;

    if(screenPercentage < 0.25){
        fragColor = vec4(alll, alll, alll, 1.0);
    }else if(screenPercentage < 0.5){
        fragColor = vec4(octaveB, octaveB, octaveB, 1.0);
    }else if(screenPercentage < 0.75){
        fragColor = vec4(octaveG, octaveG, octaveG, 1.0);
    }else{
        fragColor = vec4(octaveR, octaveR, octaveR, 1.0);
    }
}