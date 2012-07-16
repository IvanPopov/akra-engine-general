#include "decode_texture.glsl"

attribute float INDEX_POSITION;
//attribute float INDEX_NORMAL;

uniform mat4 model_mat;
uniform mat4 view_mat;
uniform mat4 proj_mat;
uniform sampler2D A_buffer_0;

varying vec3 texcoord;

void main(void) {
	A_TextureHeader vb_header;
	A_extractTextureHeader(A_buffer_0, vb_header);

	vec3 position = A_extractVec3(A_buffer_0, vb_header, INDEX_POSITION);
	//vec3 normal = A_extractVec3(A_buffer_0, vb_header, INDEX_NORMAL);
	vec4 pos = model_mat * vec4(position, 1.);
    texcoord = pos.xyz;
	gl_Position = proj_mat * view_mat * pos;
}

//<-- split -- >

#ifdef GL_ES                    
    precision highp float;      
#endif                          
#define RED vec4(1., 0., 0., 1.)
#define GREEN vec4(0., 1., 0., 1.)
#define BLUE vec4(0., 0., 1., 1.)

varying vec3 texcoord;


void main(void) {
    float x = texcoord.x;
    float z = texcoord.z;

    if (abs(x) == 0.)
        gl_FragColor = RED;
    else if(abs(z) == 0.)
        gl_FragColor = BLUE;
    else {
        if ((fract(z) == 0.) && mod(z, 5.) == 0.)
            gl_FragColor = vec4(0.35, 0.35, 0.35, 1.);
        else if ((fract(x) == 0.) && mod(x, 5.) == 0.)
            gl_FragColor = vec4(0.35, 0.35, 0.35, 1.);
        else    
            gl_FragColor = vec4(0.6, 0.6, 0.6, 1.);
    }
}