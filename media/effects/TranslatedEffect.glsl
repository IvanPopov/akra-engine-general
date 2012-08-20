/*
//FRAGMENT

#ifdef GL_ES
precision lowp float;
#endif

#ifdef GL_FRAGMENT_PRECISION_HIGH
//#define texture2D(sampler, ) texture2D
#else
#define texture2D(A, B) texture2DLod(A, B, 0.)
#endif
#ifndef A_VB_COMPONENT3
#define A_VB_COMPONENT4
#endif
#ifdef A_VB_COMPONENT4
#define A_VB_ELEMENT_SIZE 4.
#endif
#ifdef A_VB_COMPONENT3
#define A_VB_ELEMENT_SIZE 3.
#endif
#define A_tex2D(S, H, X, Y) texture2D(S, vec2(H.stepX * X , H.stepY * Y))
#define A_tex2Dv(S, H, V) texture2D(S, V)
struct A_TextureHeader {
    float width;
    float height;
    float stepX;
    float stepY;
};
struct VS_OUTPUT_0_1{
    vec4 POSITION;
    vec4 COLOR;
};
uniform sampler2D A_zero_sampler;
A_TextureHeader A_zero_header;
vec3 col_g_1=vec3(1.0,0.5,0.8);
varying vec4 COLOR;
void fragment_main_3_1(){
    {
        float t_6_1;
        col_g_1=vec3(1.0,0.5,0.0);
        gl_FragColor=(COLOR + texture2D((A_zero_sampler),(vec2(0.3,0.3))));
        return;
    }
}
void main(){
    fragment_main_3_1();
}

//VERTEX

#ifdef GL_FRAGMENT_PRECISION_HIGH
//#define texture2D(sampler, ) texture2D
#else
#define texture2D(A, B) texture2DLod(A, B, 0.)
#endif
#ifndef A_VB_COMPONENT3
#define A_VB_COMPONENT4
#endif
#ifdef A_VB_COMPONENT4
#define A_VB_ELEMENT_SIZE 4.
#endif
#ifdef A_VB_COMPONENT3
#define A_VB_ELEMENT_SIZE 3.
#endif
#define A_tex2D(S, H, X, Y) texture2D(S, vec2(H.stepX * X , H.stepY * Y))
#define A_tex2Dv(S, H, V) texture2D(S, V)
struct A_TextureHeader {
    float width;
    float height;
    float stepX;
    float stepY;
};
struct VS_OUTPUT_0_1{
    vec4 POSITION;
    vec4 COLOR;
};
struct VS_INPUT_0_1{
    vec3 POSITION;
};
uniform sampler2D A_zero_sampler;
A_TextureHeader A_zero_header;
uniform float scale_0_1;
varying vec4 COLOR;
vec3 POSITION;
float POSITION_index;
struct {
    vec4 POSITION;
    vec4 COLOR;
} Out;
void vertex_main_2_1(){
    {
        float t_3_1;
        Out.COLOR=texture2D((A_zero_sampler),(vec2(0.5,0.5)));
        Out.POSITION=vec4(POSITION * scale_0_1,1.0);
        return;
    }
}
void main(){
    vertex_main_2_1();
    COLOR=Out.COLOR;
    gl_Position=Out.POSITION;
}

#ifdef GL_ES
precision lowp float;
#endif

struct VS_OUT_0_1{
    vec4 VARCOLOR;
    vec4 POSITION;
};
varying vec4 VARCOLOR;
void fragment_main_3_1(){
    {
        gl_FragColor=(VARCOLOR);
        return;
    }
}
void main(){
    fragment_main_3_1();
}

//////////////////////////////////////



struct VS_OUT_0_1{
    vec4 VARCOLOR;
    vec4 POSITION;
};
struct VS_IN_0_1{
    float INDEX;
    float SHIFT;
    vec4 VALUE;
};
uniform sampler2D A_zero_sampler;
uniform vec2 size_0_1;
varying vec4 VARCOLOR;
float INDEX;
float SHIFT;
vec4 VALUE;
struct {
    vec4 POSITION;
    vec4 VARCOLOR;
} Out;
void vertex_main_2_1(){
    {
        int offset_11_1=int(SHIFT);
        if(offset_11_1 != 0){
            Out.VARCOLOR=texture2D((A_zero_sampler),(vec2((mod((INDEX),(size_0_1.x)) + 0.5) / size_0_1.x,(floor((INDEX / size_0_1.x)) + 0.5) / size_0_1.y)));
            if(offset_11_1 == 1){
                Out.VARCOLOR=vec4(Out.VARCOLOR.r,VALUE.gba);
            }
            else if(offset_11_1 == 2){
                Out.VARCOLOR=vec4(Out.VARCOLOR.rg,VALUE.ba);
            }
            else if(offset_11_1 == 3){
                Out.VARCOLOR=vec4(Out.VARCOLOR.rgb,VALUE.a);
            }
            else if(offset_11_1 == -1){
                Out.VARCOLOR=vec4(VALUE.r,Out.VARCOLOR.gba);
            }
            else if(offset_11_1 == -2){
                Out.VARCOLOR=vec4(VALUE.rg,Out.VARCOLOR.ba);
            }
            else {
                Out.VARCOLOR=vec4(VALUE.rgb,Out.VARCOLOR.a);
            }
        }
        else {
            Out.VARCOLOR=VALUE;
        }
        Out.POSITION=vec4(2. * (mod((INDEX),(size_0_1.x)) + 0.5) / size_0_1.x - 1.,2. * (floor((INDEX / size_0_1.x)) + 0.5) / size_0_1.y - 1.,0.,1.);
        return;
    }
}
void main(){
    vertex_main_2_1();
    VARCOLOR=Out.VARCOLOR;
    gl_Position=Out.POSITION;
}
*/

"
#ifdef GL_FRAGMENT_PRECISION_HIGH
//#define texture2D(sampler, ) texture2D
#else
#define texture2D(A, B) texture2DLod(A, B, 0.)
#endif
#ifndef A_VB_COMPONENT3
#define A_VB_COMPONENT4
#endif
#ifdef A_VB_COMPONENT4
#define A_VB_ELEMENT_SIZE 4.
#endif
#ifdef A_VB_COMPONENT3
#define A_VB_ELEMENT_SIZE 3.
#endif
#define A_tex2D(S, H, X, Y) texture2D(S, vec2(H.stepX * X , H.stepY * Y))
#define A_tex2Dv(S, H, V) texture2D(S, V)
struct A_TextureHeader {
float width; float height; float stepX; float stepY; };
void A_extractTextureHeader(const sampler2D src, out A_TextureHeader texture) {vec4 v = texture2D(src, vec2(0.)); texture = A_TextureHeader(v.r, v.g, v.b, v.a);}
float A_extractFloat(const sampler2D sampler, const A_TextureHeader header, const float offset) {float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); float y = floor(pixelNumber / header.width) + .5; float x = mod(pixelNumber, header.width) + .5; int shift = int(mod(offset, A_VB_ELEMENT_SIZE));
#ifdef A_VB_COMPONENT4
if(shift == 0) return A_tex2D(sampler, header, x, y).r; else if(shift == 1) return A_tex2D(sampler, header, x, y).g; else if(shift == 2) return A_tex2D(sampler, header, x, y).b; else if(shift == 3) return A_tex2D(sampler, header, x, y).a;
#endif
return 0.;}
vec3 A_extractVec3(const sampler2D sampler, const A_TextureHeader header, const float offset){float pixelNumber = floor(offset / A_VB_ELEMENT_SIZE); float y = floor(pixelNumber / header.width) + .5; float x = mod(pixelNumber, header.width) + .5; int shift = int(mod(offset, A_VB_ELEMENT_SIZE));
#ifdef A_VB_COMPONENT4
if(shift == 0) return A_tex2D(sampler, header, x, y).rgb; else if(shift == 1) return A_tex2D(sampler, header, x, y).gba; else if(shift == 2){ if(int(x) == int(header.width - 1.))  return vec3(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, 0., (y + 1.)).r); else return vec3(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, (x + 1.), y).r);} else if(shift == 3){ if(int(x) == int(header.width - 1.))  return vec3(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, 0., (y + 1.)).rg); else return vec3(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, (x + 1.), y).rg);}
#endif

#ifdef A_VB_COMPONENT3
if(shift == 0) return A_tex2D(sampler, header,vec2(x,header.stepY*y)).rgb; else if(shift == 1){ if(x == header.width - 1.) return vec3(A_tex2D(sampler, header, x, y).gb, A_tex2D(sampler, header, 0., (y + 1.)).r); else return vec3(A_tex2D(sampler, header, x, y).gb, A_tex2D(sampler, header, (x + 1.), y).r);} else if(shift == 3){ if(x == header.width - 1.) return vec3(A_tex2D(sampler, header, x, y).b, A_tex2D(sampler, header, 0., (y + 1.)).rg); else return vec3(A_tex2D(sampler, header, x, y).b, A_tex2D(sampler, header, (x + 1)., y).rg);}
#endif
return vec3(0);}
struct VS_OUT_0_2{vec3 TEXCOORD0;vec4 POSITION;};uniform sampler2D A_s_0;uniform mat4 MODELMATRIX;uniform mat4 PROJMATRIX;uniform mat4 VIEWMATRIX;A_TextureHeader A_h_0;varying vec3 TEXCOORD0;attribute float A_a_0;uniform float A_o_POSITION;float POSITION_index;vec3 POSITION;struct { vec4 POSITION;vec3 TEXCOORD0;} Out;void vertex_main_2_2(){{vec4 pos_temp_3_2=MODELMATRIX * vec4(POSITION,1.);Out.TEXCOORD0=pos_temp_3_2.xyz;Out.POSITION=PROJMATRIX * VIEWMATRIX * pos_temp_3_2;return;}}
void main(){A_extractTextureHeader(A_s_0,A_h_0);POSITION_index=A_a_0+A_o_POSITION;POSITION=A_extractVec3(A_s_0,A_h_0,POSITION_index);vertex_main_2_2();TEXCOORD0=Out.TEXCOORD0;gl_Position=Out.POSITION;}


