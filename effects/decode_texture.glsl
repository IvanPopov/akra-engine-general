#ifndef A_VB_COMPONENT3
#define A_VB_COMPONENT4
#endif

#ifdef A_VB_COMPONENT4
#define A_VB_ELEMENT_SIZE 4.
#endif

#ifdef A_VB_COMPONENT3
#define A_VB_ELEMENT_SIZE 3.
#endif

//#define A_tex2D(S, H, X, Y) texture2D(S, vec2(H.stepX * X, 1. - H.stepY * Y))
#define A_tex2D(S, H, X, Y) texture2D(S, vec2(H.stepX * X , H.stepY * Y))

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

//float A_TEMP;
//float A_TEMP2;
//#define A_EXTRACT_FLOAT_COMPONENT(S, H, P) (A_tex2D(S, H, (mod(P, (H).width) + .5), (floor(P / (H).width) + .5)))
//#define A_EXTRACT_FLOAT(S, H, P)  A_TEMP2 = P; A_TEMP = mod((P), A_VB_ELEMENT_SIZE); A_TEMP = (A_TEMP == 0.? A_EXTRACT_FLOAT_COMPONENT((S), (H), A_TEMP2).r : (A_TEMP == 1.? A_EXTRACT_FLOAT_COMPONENT((S), (H), A_TEMP2).g : (A_TEMP == 2.? A_EXTRACT_FLOAT_COMPONENT((S), (H), A_TEMP2).b : (A_TEMP == 3.? A_EXTRACT_FLOAT_COMPONENT((S), (H), A_TEMP2).a : 0.))));                                                             

float A_extractFloat(const sampler2D sampler, const A_TextureHeader header, const float offset) {
    float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE);         
    float y = floor(pixelNumber / header.width) + .5;
    float x = mod(pixelNumber, header.width) + .5;

    int shift = int(mod(offset, A_VB_ELEMENT_SIZE));

#ifdef A_VB_COMPONENT4
    if(shift == 0)                  return A_tex2D(sampler, header, x, y).r;
    else if(shift == 1)             return A_tex2D(sampler, header, x, y).g; 
    else if(shift == 2)             return A_tex2D(sampler, header, x, y).b;
    else if(shift == 3)             return A_tex2D(sampler, header, x, y).a;
#endif
    return 0.;
}

vec3 A_extractVec3(const sampler2D sampler, const A_TextureHeader header, const float offset) 
{        
    float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE);         
    float y = floor(pixelNumber / header.width) + .5;
    float x = mod(pixelNumber, header.width) + .5;

    int shift = int(mod(offset, A_VB_ELEMENT_SIZE));

#ifdef A_VB_COMPONENT4

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

#endif
#ifdef A_VB_COMPONENT3

    if(shift == 0)                  return A_tex2D(sampler, header,vec2(x,header.stepY*y)).rgb;
    else if(shift == 1)
    {
        if(x == header.width - 1.)  return vec3(A_tex2D(sampler, header, x, y).gb, A_tex2D(sampler, header, 0., (y + 1.)).r);
        else                        return vec3(A_tex2D(sampler, header, x, y).gb, A_tex2D(sampler, header, (x + 1.), y).r);
    }
    else if(shift == 3)
    {
        if(x == header.width - 1.)  return vec3(A_tex2D(sampler, header, x, y).b, A_tex2D(sampler, header, 0., (y + 1.)).rg);
        else                        return vec3(A_tex2D(sampler, header, x, y).b, A_tex2D(sampler, header, (x + 1)., y).rg);
    }

#endif
    return vec3(0);
}

vec4 A_extractVec4(const sampler2D sampler, const A_TextureHeader header, const float offset) 
{        
    float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE);         
    float y = floor(pixelNumber / header.width) + .5;
    float x = mod(pixelNumber, header.width) + .5;

    int shift = int(mod(offset, A_VB_ELEMENT_SIZE));

#ifdef A_VB_COMPONENT4

    if(shift == 0)                  return A_tex2D(sampler, header, x, y);
    else if(shift == 1)   
    {
        if(int(x) == int(header.width - 1.))  
            return vec4(A_tex2D(sampler, header, x, y).gba, A_tex2D(sampler, header, 0., (y + 1.)).r); 
        else                        
            return vec4(A_tex2D(sampler, header, x, y).gba, A_tex2D(sampler, header, (x + 1.), y).r);
    }          
    else if(shift == 2)
    {
        if(int(x) == int(header.width - 1.))  
            return vec4(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, 0., (y + 1.)).rg); 
        else                       
            return vec4(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, (x + 1.), y).rg);
    }
    else if(shift == 3)
    {
        if(int(x) == int(header.width - 1.))  
            return vec4(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, 0., (y + 1.)).rgb); 
        else                        
            return vec4(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, (x + 1.), y).rgb); 
    }

#endif
#ifdef A_VB_COMPONENT3
#endif
    return vec4(0);
}