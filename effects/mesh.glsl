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

#ifdef USE_ANIMATION
uniform mat4 bind_matrix;
#endif
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


//mat4 transpose(mat4 mat) {
//    mat4 t = mat;
//    for (int i = 0; i < 4; ++ i) {
//        for (int j = 0; j < 4; ++ j) {
//            mat[i][j] = t[j][i];
//        }
//    }
//    return mat;
//}



void main(void) {
	A_TextureHeader vb_header;
	A_extractTextureHeader(A_buffer_0, vb_header);

	vec4 position = A_extractVec4(A_buffer_0, vb_header, INDEX_POSITION + INDEX_POSITION_OFFSET);
	vec4 normal = A_extractVec4(A_buffer_0, vb_header, INDEX_NORMAL + INDEX_NORMAL_OFFSET);
	
	mat_ambient = A_extractVec4(A_buffer_0, vb_header, INDEX_FLEXMAT + 0.);
	mat_diffuse = A_extractVec4(A_buffer_0, vb_header, INDEX_FLEXMAT + 4.);
	mat_specular = A_extractVec4(A_buffer_0, vb_header, INDEX_FLEXMAT + 8.);
	mat_emissive = A_extractVec4(A_buffer_0, vb_header, INDEX_FLEXMAT + 12.);
	mat_shininess = A_extractFloat(A_buffer_0, vb_header, INDEX_FLEXMAT + 16.);

	vec4 pos = vec4(position.xyz, 1.);
    vec4 vertex;

#ifdef USE_ANIMATION
    
    float meta_ptr = position.w;
    vec2 meta_data = A_extractVec2(A_buffer_0, vb_header, meta_ptr);
    
    int number_matrix = int(meta_data.x);
    int bone_inf_ptr = int(meta_data.y);

    vec2 temp;
    float bone_matrix_ptr;
    float weight_ptr;

    float weight;
    //float total_weight = 0.0;
    mat4 bone_matrix;
    mat4 result_mat = mat4(0.);

    float point_size = 1.;

    for (int i = 0; i < 32; i ++) {
        if(i >= number_matrix) {
            break;
        }
        //get data about matrix and weight
        temp = A_extractVec2(A_buffer_0, vb_header, float(bone_inf_ptr + i * 2));
        
        bone_matrix_ptr = floor(temp.x);
        weight_ptr      = temp.y;


        //get matrix
        bone_matrix = A_extractMat4(A_buffer_0, vb_header, bone_matrix_ptr);
        //bone_matrix[0] = A_extractVec4(A_buffer_0, vb_header, bone_matrix_ptr);
        //bone_matrix[1] = A_extractVec4(A_buffer_0, vb_header, bone_matrix_ptr + 4.);
        //bone_matrix[2] = A_extractVec4(A_buffer_0, vb_header, bone_matrix_ptr + 8.);
        //bone_matrix[3] = A_extractVec4(A_buffer_0, vb_header, bone_matrix_ptr + 12.);

        //get weight
        weight = A_extractFloat(A_buffer_0, vb_header, weight_ptr);

        result_mat += bone_matrix * weight;
       // total_weight += weight;
    }
    //result_mat /= total_weight;
    //if (result_mat[0] == vec4(0) && 
    //    result_mat[1] == vec4(0) && 
    //    result_mat[2] == vec4(0) && 
    //    result_mat[3] == vec4(0)) {
    //    result_mat = mat4(1);
    //}
    
    gl_PointSize = point_size;
    vertex = (view_mat * result_mat * bind_matrix * pos);
    vertex.w = 1.0;
    norm = normalize((result_mat * normal).xyz);
#else
	vertex = (view_mat * model_mat * pos);
    norm = normalize((normal_mat * normal.xyz));
#endif

    vert = vertex.xyz;

#ifdef USE_TEXTURE_MATERIALS
    vec2 tc = A_extractVec2(A_buffer_0, vb_header, INDEX_TEXCOORD + INDEX_TEXCOORD_OFFSET);
    texcoord = vec2(tc.x, tc.y);
#endif

	gl_Position = proj_mat * vertex;
}

//<-- split -- >

#ifdef GL_ES                    
    precision highp float;      
#endif                          

uniform vec3 eye_pos;
uniform mat4 model_mat;
uniform mat4 view_mat;

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
	LIGHTPOINT light_point;
	light_point.position = vec4(10., 20., 10., 1.);
    light_point.ambient = vec4(1., 1., 1., 1.);
    light_point.diffuse  =vec4(1., 1., 1., 1.);
    light_point.specular = vec4(1., 1., 1., 1.);
    light_point.attenuation = vec3(1., 0.00, .000);

     // direction on source of light (LightDir)
    vec3 light_dir = light_point.position.xyz - vert;
    float light_dir_length = length(light_dir);
    light_dir = normalize(light_dir);
    
    // direction from vert to observer (ViewDir)
    vec3 view_dir = normalize((view_mat * model_mat * vec4(eye_pos, 1.0)).xyz - vert);
    
    // length from source of light to vert
    vec3 light_distance = normalize(reflect(-light_dir, norm));

    // attenuation
    float attenuation = 1.0 / (light_point.attenuation.x + 
    	light_point.attenuation.y * 
    	light_dir_length + light_point.attenuation.z * 
    	light_dir_length * light_dir_length);

    // add material emisson
    vec4 color = (mat_emissive 
#ifdef USE_TEXTURE_MATERIALS
        + texture2D(tex_emissive, texcoord)
#endif
        );

    // add ambient
    color += (mat_ambient 
#ifdef USE_TEXTURE_MATERIALS
        + texture2D(tex_ambient, texcoord)
#endif
        ) * light_point.ambient * attenuation;
    
    // add diffuse lighting
    color += (mat_diffuse 
#ifdef USE_TEXTURE_MATERIALS
        + texture2D(tex_diffuse, texcoord)
#endif
        ) * light_point.diffuse * max(dot(norm, light_dir), .0) * attenuation;
    //color *= serial;

    // add reflect lighting
    //float light_distancedotVpow = max(pow(dot(light_distance, view_dir), mat_shininess), 0.0);
    float light_distancedotVpow = pow(max(dot(light_distance, view_dir), .0), mat_shininess);
    color += (mat_specular 
#ifdef USE_TEXTURE_MATERIALS
        + texture2D(tex_specular, texcoord)
#endif
        ) * light_point.specular * light_distancedotVpow * attenuation;
 
    gl_FragColor = vec4(color.xyz, 1.);
}