#include "decode_texture.glsl"

attribute float INDEX0;

uniform mat4 model_mat;
uniform mat4 view_mat;
uniform mat4 proj_mat;
uniform sampler2D A_buffer_0;

varying vec3 texcoord;
varying vec4 vDiffuse;
varying vec4 pos;
varying vec3 normal;

void main(void) {
	A_TextureHeader vb_header;
	A_extractTextureHeader(A_buffer_0, vb_header);

	 vec4 ambient_light = vec4(0.5, 0.5, 0.7, 0.0);
     vec4 sun_vec = vec4(0.578, 0.578, 0.578, 0.0);

	vec3 position = A_extractVec3(A_buffer_0, vb_header, INDEX0 );
	normal = A_extractVec3(A_buffer_0, vb_header, INDEX0 + 3.);
	pos = model_mat * vec4(position, 1.);


	vDiffuse = dot(normal, sun_vec.rgb) + ambient_light;

    texcoord = pos.xyz;
	gl_Position = proj_mat * view_mat * pos;
	//gl_PointSize = 50.;
}

//<-- split -- >

#ifdef GL_ES                    
    precision highp float;      
#endif                          
#define RED vec4(1., 0., 0., 1.)
#define GREEN vec4(0., 1., 0., 1.)
#define BLUE vec4(0., 0., 1., 1.)

varying vec3 texcoord;
varying vec4 vDiffuse;
varying vec4 pos;
varying vec3 normal;
void main(void)
{
    vec4 color = RED * vDiffuse;
    color.a = 1.;
    gl_FragColor = color;
}