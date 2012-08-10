#include "decode_texture.glsl"

attribute float INDEX_POSITION;
//attribute float INDEX_NORMAL;
//attribute float INDEX_FLEXMAT;
attribute float INDEX_PARTICLE;
uniform float INDEX_POSITION_OFFSET;
//uniform float INDEX_NORMAL_OFFSET;
//uniform float INDEX_FLEXMAT_OFFSET;
uniform float INDEX_PARTICLE_POSITION_OFFSET;
uniform float INDEX_PARTICLE_COLOUR_OFFSET;
uniform float INDEX_PARTICLE_FREQUENCY_OFFSET;
uniform float INDEX_LIVE_TIME_OFFSET;
uniform float INDEX_TEXTURE_POSITION_OFFSET;
uniform float t;

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

varying float opacity;
varying vec2 texturePosition;
varying vec3 baseColor;
//varying float serial;

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

    vec3 positionOffset = A_extractVec3(A_buffer_0, vb_header, INDEX_PARTICLE + INDEX_PARTICLE_POSITION_OFFSET);
    vec3 position = A_extractVec3(A_buffer_0, vb_header, INDEX_POSITION + INDEX_POSITION_OFFSET);
    //vec3 normal = A_extractVec3(A_buffer_0, vb_header, INDEX_NORMAL + INDEX_NORMAL_OFFSET);
    vec3 normal = vec3(0.,0.,1.);
    baseColor = A_extractVec3(A_buffer_0, vb_header, INDEX_PARTICLE + INDEX_PARTICLE_COLOUR_OFFSET);
    vec3 frequency = A_extractVec3(A_buffer_0, vb_header, INDEX_PARTICLE + INDEX_PARTICLE_FREQUENCY_OFFSET);

    float fLiveTime = A_extractFloat(A_buffer_0, vb_header, INDEX_PARTICLE + INDEX_LIVE_TIME_OFFSET);

    texturePosition = A_extractVec4(A_buffer_0, vb_header, INDEX_POSITION + INDEX_TEXTURE_POSITION_OFFSET).rg;//(position.xy+1.)/2.;
    //texturePosition = (position.xy + 1.)/2.;

    mat3 rotMatrix = rotationMatrix(frequency*t);
    //position = rotMatrix*position + positionOffset;
    normal = rotMatrix*normal;

    //mat_ambient = vec4(0.5,0.5,0.5,1.);//A_extractVec4(A_buffer_0, vb_header, INDEX_FLEXMAT + 0.);
    mat_ambient = vec4(baseColor,1.);
    mat_diffuse = vec4(baseColor,1.);//vec4(0.5,0.5,0.5,1.);//A_extractVec4(A_buffer_0, vb_header, INDEX_FLEXMAT + 4.);
    mat_specular = vec4(1.,1.,1.,1.);//A_extractVec4(A_buffer_0, vb_header, INDEX_FLEXMAT + 8.);
    mat_emissive = vec4(0.1);//A_extractVec4(A_buffer_0, vb_header, INDEX_FLEXMAT + 12.);
    mat_shininess = 30.;//A_extractFloat(A_buffer_0, vb_header, INDEX_FLEXMAT + 16.);

    


    norm = normalize(normal);
    
    //serial = SERIAL;

    opacity = 1.-mod(t,fLiveTime)/fLiveTime;
    //superColor = vec4(color,opacity);

    vec4 pos = view_mat * model_mat * vec4(positionOffset.xyz, 1.) + vec4(position*2.*opacity,0.);
    vert = pos.xyz;

    gl_Position = proj_mat * pos;
}

//<-- split -- >

#ifdef GL_ES                    
    precision highp float;      
#endif                          

uniform vec3 eye_pos;
uniform sampler2D particleTexture;

varying vec3 vert;
varying vec3 norm;
//varying float serial;

varying vec4 mat_ambient;
varying vec4 mat_diffuse;
varying vec4 mat_specular;
varying vec4 mat_emissive;
varying float mat_shininess;

varying float opacity;

varying vec2 texturePosition;
varying vec3 baseColor;

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
    //light_point.position = vec4(1., 1., 1., 1.);
    light_point.position = vec4(0., 40., 0., 1.);
    light_point.ambient = vec4(1., 1., 1., 1.);
    light_point.diffuse  =vec4(1., 1., 1., 1.);
    light_point.specular = vec4(1., 1., 1., 1.);
    light_point.attenuation = vec3(.1, 0.00, .001);

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
    vec4 textureColor = texture2D(particleTexture,texturePosition);
    //vec4 textureColor = texture2D(particleTexture,vec2(0.0));
    // add reflect lighting
    //float light_distancedotVpow = max(pow(dot(light_distance, view_dir), mat_shininess), 0.0);
    float light_distancedotVpow = pow(max(dot(light_distance, view_dir), .0), mat_shininess);
    color += mat_specular * light_point.specular * light_distancedotVpow * attenuation;
 

    gl_FragColor = textureColor*vec4(baseColor,opacity);// vec4(color.xyz, opacity);//superColor;//// ;
}
