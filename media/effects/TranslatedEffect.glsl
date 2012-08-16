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
*/
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



