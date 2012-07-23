#include "decode_texture.glsl"
#define INDEX_POSITION INDEX0
#define INDEX_FLEXMAT INDEX10



attribute float INDEX_POSITION;
attribute float INDEX_FLEXMAT; 
uniform float INDEX_POSITION_OFFSET;
uniform float INDEX_FLEXMAT_OFFSET;

uniform mat4 model_mat;
uniform mat4 view_mat;
uniform mat4 proj_mat;
uniform mat3 normal_mat;
uniform sampler2D A_buffer_0;

varying vec3 vert;

varying vec4 mat_ambient;
varying vec4 mat_diffuse;
varying vec4 mat_specular;
varying vec4 mat_emissive;
varying float mat_shininess;

void main(void) {
	A_TextureHeader vb_header;
	A_extractTextureHeader(A_buffer_0, vb_header);

	vec4 position = A_extractVec4(A_buffer_0, vb_header, INDEX_POSITION + INDEX_POSITION_OFFSET);

	mat_ambient = A_extractVec4(A_buffer_0, vb_header, INDEX_FLEXMAT + 0.);
	mat_diffuse = A_extractVec4(A_buffer_0, vb_header, INDEX_FLEXMAT + 4.);
	mat_specular = A_extractVec4(A_buffer_0, vb_header, INDEX_FLEXMAT + 8.);
	mat_emissive = A_extractVec4(A_buffer_0, vb_header, INDEX_FLEXMAT + 12.);
	mat_shininess = A_extractFloat(A_buffer_0, vb_header, INDEX_FLEXMAT + 16.);

	vec4 pos = vec4(position.xyz, 1.);
    vec4 vertex;


	vertex = (view_mat * model_mat * pos);
    
    vert = vertex.xyz;
	gl_Position = proj_mat * vertex;
}

//<-- split -- >

#ifdef GL_ES                    
    precision highp float;      
#endif                          

uniform vec3 eye_pos;

varying vec3 vert;

varying vec4 mat_ambient;
varying vec4 mat_diffuse;
varying vec4 mat_specular;
varying vec4 mat_emissive;
varying float mat_shininess;

void main(void) {
    vec4 color = vec4(1.);//(mat_emissive);
    gl_FragColor = vec4(color.xyz, 1.);
}