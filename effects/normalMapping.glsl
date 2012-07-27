#include "decode_texture.glsl"

attribute vec2 POSITION_OFFSET;
attribute vec2 TEXTURE_POSITION;

uniform vec3 CENTER_POSITION;

uniform mat4 model_mat;
uniform mat4 view_mat;
uniform mat4 proj_mat;
uniform sampler2D A_buffer_0;

varying vec2 texturePosition;

mat3 rotationMatrix(vec3 angles){

    mat3 rotX = mat3(1.,0.,0.,
                    0.,cos(angles.x),sin(angles.x),
                    0.,-sin(angles.x),cos(angles.x));

    mat3 rotY = mat3(cos(angles.y),0.,-sin(angles.y),
                        0.,1.,0.,
                        sin(angles.y),0.,cos(angles.y));

    mat3 rotZ = mat3(cos(angles.z),sin(angles.z),0.,
                     -sin(angles.z),cos(angles.z),0.,
                        0.,0.,1.);

    return rotZ*rotY*rotX;
}

void main(void) {
    A_TextureHeader vb_header;
    A_extractTextureHeader(A_buffer_0, vb_header);

    texturePosition = TEXTURE_POSITION;

    vec4 pos = view_mat * model_mat * vec4(CENTER_POSITION, 1.) + vec4(POSITION_OFFSET,0.,0.);
    //vert = pos.xyz;

    gl_Position = proj_mat * pos;
}

//<-- split -- >

#ifdef GL_ES                    
    precision highp float;      
#endif                          

uniform vec3 eye_pos;
uniform sampler2D spriteTexture;
uniform sampler2D spriteNormalTexture;
uniform mat4 model_mat;
uniform mat4 view_mat;

varying vec2 texturePosition;

const vec3 dirDif = vec3(0., 0., 1.);
const vec3 dirHalf = vec3(-.4034, .259, .8776);

void main(void) {

    vec4 textureColor = texture2D(spriteTexture,texturePosition);
    vec4 tempNormals = texture2D(spriteNormalTexture,texturePosition);
    vec3 normal = normalize(vec3(tempNormals.xy - 128./255.,tempNormals.z));

    //normal = vec3(0.,0.,1.);
    normal = (view_mat * model_mat * vec4(normal,0.)).xyz;

    gl_FragColor = textureColor;

    float i = 2.*max( 0., abs(dot(normal, dirDif)));
    vec4 frontColor = vec4(.7*i, .7*i, .9*i, 1.);
    i = pow( max( 0., abs(dot(normal, dirHalf))), 45.);
    frontColor += vec4(i, i, i, 0.);  


    gl_FragColor *= frontColor;
}
