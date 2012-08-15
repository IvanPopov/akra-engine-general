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




