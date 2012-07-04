#include "decode_texture.glsl"

attribute float INDEX_POSITION;
attribute float INDEX_NORMAL;
attribute float INDEX_FLEXMAT;
//attribute float SERIAL;

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
//varying float serial;

void main(void) {
	A_TextureHeader vb_header;
	A_extractTextureHeader(A_buffer_0, vb_header);

	vec3 position = A_extractVec3(A_buffer_0, vb_header, INDEX_POSITION);
	vec3 normal = A_extractVec3(A_buffer_0, vb_header, INDEX_NORMAL);
	
	mat_ambient = vec4(.5 + INDEX_FLEXMAT * 0.0000001,.5,.5,1.);//A_extractVec4(A_buffer_0, vb_header, INDEX_FLEXMAT + 0.);
	mat_diffuse = vec4(.5,.5,.5,1.);//A_extractVec4(A_buffer_0, vb_header, INDEX_FLEXMAT + 4.);
	mat_specular = vec4(.0,.0,.0,1.);//A_extractVec4(A_buffer_0, vb_header, INDEX_FLEXMAT + 8.);
	mat_emissive = vec4(.0,.0,.0,1.);//A_extractVec4(A_buffer_0, vb_header, INDEX_FLEXMAT + 12.);
	mat_shininess = 70.;//A_extractFloat(A_buffer_0, vb_header, INDEX_FLEXMAT + 16.);

	vec4 pos = view_mat * model_mat * vec4(position.xyz, 1.);

	norm = normalize((normal_mat * normal));
	vert = pos.xyz;
    //serial = SERIAL;

	gl_Position = proj_mat * pos;
}

//<-- split -- >

#ifdef GL_ES                    
    precision highp float;      
#endif                          

uniform vec3 eye_pos;

varying vec3 vert;
varying vec3 norm;
//varying float serial;

varying vec4 mat_ambient;
varying vec4 mat_diffuse;
varying vec4 mat_specular;
varying vec4 mat_emissive;
varying float mat_shininess;

struct LIGHTPOINT {
	vec4 position;
 	vec4 ambient;
	vec4 diffuse;
	vec4 specular;
	vec4 emissive;
	vec3 attenuation;
};

void main(void) {
	LIGHTPOINT light_point;
	light_point.position = vec4(1., 1., 1., 1.);
    light_point.ambient = vec4(1., 1., 1., 1.);
    light_point.diffuse  =vec4(1., 1., 1., 1.);
    light_point.specular = vec4(1., 1., 1., 1.);
    light_point.attenuation = vec3(.0, 0.05, .0);

     // direction on source of light (LightDir)
    vec3 light_dir = light_point.position.xyz - vert;
    float light_dir_length = length(light_dir);
    light_dir = normalize(light_dir);
    
    // direction from vert to observer (ViewDir)
    vec3 view_dir = normalize(eye_pos - vert);
    
    // length from source of light to vert
    vec3 light_distance = normalize(reflect(-light_dir, norm));

    // attenuation
    float attenuation = 1.0 / (light_point.attenuation.x + 
    	light_point.attenuation.y * 
    	light_dir_length + light_point.attenuation.z * 
    	light_dir_length * light_dir_length);

    // add material emisson
    vec4 color = mat_emissive;

    // add ambient
    color += mat_ambient * light_point.ambient * attenuation;
    
    // add diffuse lighting
    color += mat_diffuse * light_point.diffuse * max(dot(norm, light_dir), .0) * attenuation;
    //color *= serial;

    // add reflect lighting
    //float light_distancedotVpow = max(pow(dot(light_distance, view_dir), mat_shininess), 0.0);
    float light_distancedotVpow = pow(max(dot(light_distance, view_dir), .0), mat_shininess);
    color += mat_specular * light_point.specular * light_distancedotVpow * attenuation;
 
    gl_FragColor = vec4(color.xyz, 1.);
}