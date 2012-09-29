#include "decode_texture.glsl"
#define INDEX_POSITION INDEX0

attribute float INDEX_POSITION;
const float INDEX_POSITION_OFFSET = 0.;


uniform mat4 skyBoxMatrix;
uniform sampler2D A_buffer_0;

varying vec4 vTex0;

void main(void) {
    A_TextureHeader vb_header;
    A_extractTextureHeader(A_buffer_0, vb_header);

    vec4 position = A_extractVec4(A_buffer_0, vb_header, INDEX_POSITION + INDEX_POSITION_OFFSET);
    
    
    vec4 tmp;
    tmp.xyz = position.xyz;
    //tmp.z -= 5.;
    tmp.w = 1.;

    gl_Position = tmp;               
     
     tmp.w = 0.;
    vTex0 = (skyBoxMatrix * tmp);                         
}

//<-- split -- >

#ifdef GL_ES                    
    precision highp float;      
#endif        

varying vec4 vTex0;                                 
uniform samplerCube  cubeMap;  
                                       
void main(void) {
     gl_FragColor = textureCube(cubeMap, vTex0.xyz); 
     gl_FragColor.a = 1.0;      
}
