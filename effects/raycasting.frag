#ifdef GL_ES                  
	precision highp float;      
#endif  

uniform float NormalsOffset;
uniform float VerticesOffset;
uniform float IndicesOffset;

uniform sampler2D dataBuffer;
uniform vec3 cameraPos;

#define A_tex2D(S, H, X, Y) texture2D(S, vec2(H.stepX * X + .5 * H.stepX, H.stepY * Y + .5 * H.stepY))

struct A_TextureHeader {
    float width;
    float height;
    float stepX;
    float stepY;
};

void A_extractTextureHeader(const sampler2D src, out A_TextureHeader texture) {
    vec4 v = texture2D(src, vec2(0.));
    texture = A_TextureHeader(v.r, v.g, v.b, v.a);
}


float A_extractFloat(const sampler2D sampler, const A_TextureHeader header, const float offset) {
    float pixelNumber = floor(offset / 4.);         
    float y = floor(pixelNumber / header.width);
    float x = mod(pixelNumber, header.width);

    int shift = int(mod(offset, 4.));

    if(shift == 0)                  return A_tex2D(sampler, header, x, y).r;
    else if(shift == 1)             return A_tex2D(sampler, header, x, y).g; 
    else if(shift == 2)             return A_tex2D(sampler, header, x, y).b;
    else if(shift == 3)             return A_tex2D(sampler, header, x, y).a;
    return 0.;
}

vec3 A_extractVec3(const sampler2D sampler, const A_TextureHeader header, const float offset) 
{        
    float pixelNumber = floor(offset / 4.);         
    float y = floor(pixelNumber / header.width);
    float x = mod(pixelNumber, header.width);

    int shift = int(mod(offset, 4.));

    if(shift == 0)                  return A_tex2D(sampler, header, x, y).rgb;
    else if(shift == 1)             return A_tex2D(sampler, header, x, y).gba; 
    else if(shift == 2)
    {
        if(int(x) == int(header.width - 1.))  return vec3(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, 0., (y + 1.)).r); 
        else                        return vec3(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, (x + 1.), y).r);
    }
    else if(shift == 3)
    {
        if(int(x) == int(header.width - 1.))  return vec3(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, 0., (y + 1.)).rg); 
        else                        return vec3(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, (x + 1.), y).rg); 
    }
    return vec3(0);
}

A_TextureHeader dataTextureHeader;

void main(void) {
	A_extractTextureHeader(dataBuffer, dataTextureHeader);
	float t = NormalsOffset + VerticesOffset + IndicesOffset;
	if(mod(floor(gl_FragCoord.y),5.0) > 0.5)
		gl_FragColor=vec4(1.0,1.0,1.0,1.0 + t * 0.00000001 * cameraPos.x);
	else
		gl_FragColor=vec4(0.0,1.0,1.0,1.0);
}