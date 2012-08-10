attribute vec2 POSITION;
varying vec2 texturePosition;

void main(void){
    texturePosition = (POSITION + vec2(1.,1.))/2.;
    gl_Position = vec4(POSITION,0.,1.);
}

//<-- split -- >

#ifdef GL_ES
precision highp float;
#endif

uniform float fStep; 
uniform float fScale;
uniform float fFalloff;

uniform int iOctaves;

uniform vec2 v2fNoiseSize;
uniform vec3 v3fIntermediateTextureSize;
uniform sampler2D intermediateTexture;


varying vec2 texturePosition;

float buildNumber(vec4 iVector){
    float result = 0.;
    if(iVector.x != 0.)
        result += iVector.x * 16777216.;
    if(iVector.y!=0.)
        result += iVector.y * 65536.;
    if(iVector.z!=0.)
        result += iVector.z * 256.;
    if(iVector.a!=0.)
        result += iVector.a;
    return result;
}

vec2 getVec(float fX, float fY){
    vec4 temp;
    
    temp = texture2D(intermediateTexture,vec2(
        (mod(fX,v3fIntermediateTextureSize.x) + 0.5)/v3fIntermediateTextureSize.x,
        (floor(fX/v3fIntermediateTextureSize.x) + 0.5)/v3fIntermediateTextureSize.y));
    float fA =  buildNumber(temp*255.);

    temp = texture2D(intermediateTexture,vec2(
        (mod(fY,v3fIntermediateTextureSize.x) + 0.5)/v3fIntermediateTextureSize.x,
        (floor(fY/v3fIntermediateTextureSize.x) + 0.5)/v3fIntermediateTextureSize.y));
    float fB = buildNumber(temp*255.);

    float fZ = mod(fA+fB,v3fIntermediateTextureSize.z);
    
    temp = texture2D(intermediateTexture,vec2(
        (mod(fZ,v3fIntermediateTextureSize.x) + 0.5)/v3fIntermediateTextureSize.x,
        (floor(fZ/v3fIntermediateTextureSize.x) + 0.5)/v3fIntermediateTextureSize.y));
    
    float pos = buildNumber(temp*255.);
    
    return vec2(sin(fStep*pos),cos(fStep*pos));
}

float perlinNoise(float fX,float fY,float fScale){

    vec2 pos = vec2(fX*fScale,fY*fScale);

    float X0 = floor(pos.x);
    float X1 = X0 + 1.;
    float Y0 = floor(pos.y);
    float Y1 = Y0 + 1.;

    vec2 v0 = getVec(X0,Y0);
    vec2 v1 = getVec(X0,Y1);
    vec2 v2 = getVec(X1,Y0);
    vec2 v3 = getVec(X1,Y1);

    vec2 d0 = vec2(pos.x-X0, pos.y-Y0);
    vec2 d1 = vec2(pos.x-X0, pos.y-Y1);
    vec2 d2 = vec2(pos.x-X1, pos.y-Y0);
    vec2 d3 = vec2(pos.x-X1, pos.y-Y1);

    float h0 = dot(d0,v0);
    float h1 = dot(d1,v1);
    float h2 = dot(d2,v2);
    float h3 = dot(d3,v3);

    float Sx = 6.*pow(d0.x,5.0) - 15.*pow(d0.x,4.0) + 10.*pow(d0.x,3.0);
    float Sy = 6.*pow(d0.y,5.0) - 15.*pow(d0.y,4.0) + 10.*pow(d0.y,3.0);

    float avgX0 = h0 + Sx*(h2-h0);
    float avgX1 = h1 + Sx*(h3-h1);

    return avgX0 + Sy*(avgX1 - avgX0);
}

void main(void){
    vec2 coord = vec2(texturePosition.x*v2fNoiseSize.x,texturePosition.y*v2fNoiseSize.y);

    float fAccum = 0.;
    float fFrequency = fScale;
    float fAmplitude = 1.0;

    //TODO: fix me

    for (int i=0; i < 8; i++){
    	if(i >= iOctaves){
        	break;
        }
        fAccum += perlinNoise(coord.x,coord.y,fFrequency) * fAmplitude;
        fAmplitude *= fFalloff;
        fFrequency *= 2.0;
    }
    fAccum = clamp(fAccum, -1.0, 1.0)*0.5 + 0.5;

    gl_FragColor = vec4(fAccum,fAccum,fAccum,fAccum);
}
