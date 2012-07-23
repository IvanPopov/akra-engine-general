#include "decode_texture.glsl"
#define INDEX_POSITION INDEX0
#define INDEX_NORMAL INDEX1
#define INDEX_TEXCOORD INDEX2
#define INDEX_FLEXMAT INDEX10


#ifdef USE_TEXTURE_MATERIALS
attribute float INDEX_TEXCOORD;
uniform float INDEX_TEXCOORD_OFFSET;
varying vec2 texcoord;
#endif

attribute float INDEX_POSITION;
attribute float INDEX_NORMAL;
attribute float INDEX_FLEXMAT; 
uniform float INDEX_POSITION_OFFSET;
uniform float INDEX_NORMAL_OFFSET;
uniform float INDEX_FLEXMAT_OFFSET;


uniform mat4 model_mat;
uniform mat4 view_mat;
uniform mat4 proj_mat;
uniform mat3 normal_mat;
uniform sampler2D A_buffer_0;

varying vec3 vert;
varying vec3 norm;

varying vec4 mat_ambient;
varying vec4 mat_diffuse;
varying vec4 mat_specular;
varying vec4 mat_emissive;
varying float mat_shininess;


void main(void) {
	A_TextureHeader vb_header;
	A_extractTextureHeader(A_buffer_0, vb_header);

	vec3 position = A_extractVec3(A_buffer_0, vb_header, INDEX_POSITION + INDEX_POSITION_OFFSET);
	vec3 normal = A_extractVec3(A_buffer_0, vb_header, INDEX_NORMAL + INDEX_NORMAL_OFFSET);
	
	mat_ambient = A_extractVec4(A_buffer_0, vb_header, INDEX_FLEXMAT + 0.);
	mat_diffuse = A_extractVec4(A_buffer_0, vb_header, INDEX_FLEXMAT + 4.);
	mat_specular = A_extractVec4(A_buffer_0, vb_header, INDEX_FLEXMAT + 8.);
	mat_emissive = A_extractVec4(A_buffer_0, vb_header, INDEX_FLEXMAT + 12.);
	mat_shininess = A_extractFloat(A_buffer_0, vb_header, INDEX_FLEXMAT + 16.);

	vec4 pos = view_mat * model_mat * vec4(position.xyz, 1.);


	//norm = normalize((normal_mat * normal));
    //norm = normalize(view_mat * model_mat * vec4(normal,0.)).xyz;
    norm = (view_mat*vec4(normal,0.)).xyz;
	vert = pos.xyz;

#ifdef USE_TEXTURE_MATERIALS
    vec2 tc = A_extractVec2(A_buffer_0, vb_header, INDEX_TEXCOORD + INDEX_TEXCOORD_OFFSET);
    texcoord = vec2(tc.x, tc.y);
#endif

	gl_Position = proj_mat * vec4(pos.rgb,1.);
}

//<-- split -- >

#ifdef GL_ES                    
    precision highp float;      
#endif                          

#include "special_functions.glsl"

uniform vec3 eye_pos;

varying vec3 vert;
varying vec3 norm;
//varying float serial;

varying vec4 mat_ambient;
varying vec4 mat_diffuse;
varying vec4 mat_specular;
varying vec4 mat_emissive;
varying float mat_shininess;

#define tex_diffuse TEXTURE0
#define tex_ambient TEXTURE1
#define tex_specular TEXTURE2
#define tex_emissive TEXTURE3

#ifdef USE_TEXTURE_MATERIALS
uniform sampler2D tex_ambient;
uniform sampler2D tex_diffuse;
uniform sampler2D tex_specular;
uniform sampler2D tex_emissive;
varying vec2 texcoord;
#endif

void main(void) {

    #ifdef USE_TEXTURE_MATERIALS
        vec4 emissive = texture2D(tex_emissive, texcoord);
        //vec4 ambient = texture2D(tex_ambient, texcoord);
        vec4 diffuse = texture2D(tex_diffuse, texcoord);
        vec4 specular = texture2D(tex_specular, texcoord);
    #else
        vec4 emissive = mat_emissive;
        //vec4 ambient = mat_ambient;
        vec4 diffuse = mat_diffuse;
        vec4 specular = mat_specular;
    #endif
        vec4 ambient = mat_ambient;
        float shininess = mat_shininess;

    vec3 normal =normalize(norm);
 
    
    vec4 first = vec4((normal.xyz + 1.)/2.,shininess/255.);


    //float firstValue = vec4ToFloat(first);

    #ifdef FIRST_PASS
    float firstValue = vec3ToFloat(vec3((normal.xy + 1.)/2.,shininess/255.));
    float secondValue = vec3ToFloat(ambient.xyz);
    float thirdValue = vec3ToFloat(diffuse.xyz);
    float forthValue = vec3ToFloat(specular.xyz);
    #else
    float firstValue = vert.x;
    float secondValue = vert.y;
    float thirdValue = vert.z;
    float forthValue = vec3ToFloat(emissive.xyz);
    #endif

    gl_FragColor = vec4(firstValue,secondValue,thirdValue,forthValue);
}