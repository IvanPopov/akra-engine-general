#include "decode_texture.glsl"

attribute vec2 POSITION_OFFSET;
attribute vec2 TEXTURE_POSITION;

uniform vec3 CENTER_POSITION;

uniform mat4 model_mat;
uniform mat4 view_mat;
uniform mat4 proj_mat;
uniform sampler2D A_buffer_0;

varying vec2 texturePosition;

varying vec3 vertex;

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

    vec4 pos = view_mat * model_mat * (vec4(CENTER_POSITION, 1.) + vec4(POSITION_OFFSET,0.,0.));
    vertex = pos.xyz;

    gl_Position = proj_mat * pos;
}

//<-- split -- >

#ifdef GL_ES                    
    precision highp float;      
#endif                          

uniform vec3 eye_pos;

uniform sampler2D heightTexture;
uniform sampler2D normalTexture;
uniform sampler2D baseTexture;
uniform mat4 model_mat;
uniform mat4 view_mat;

uniform float fScale;

uniform vec3 light_position;

varying vec2 texturePosition;

varying vec3 vertex;

struct LIGHTPOINT {
    vec4 position;
    vec4 ambient;
    vec4 diffuse;
    vec4 specular;
    vec4 emissive;
    vec3 attenuation;
};

void main(void) {

    vec4 height = (texture2D(heightTexture,texturePosition)*2. - 1.)*fScale;
    vec4 tempNormal = texture2D(normalTexture,texturePosition);    
    //tempNormal.xyz = normalize(tempNormal.xyz*2. - 1.);
    tempNormal.xyz = normalize(vec3(tempNormal.xy - 128./255.,tempNormal.z));

    // direction from vert to observer (ViewDir)
    vec3 view_dir = normalize(eye_pos - vertex);

    float fSpeed = dot(tempNormal.xyz + view_dir,vec3(0.,0.,1.));

    vec3 tangent = normalize(vec3(1.,0.,-(tempNormal.x/tempNormal.z)));
    vec3 binormal = vec3(0.,1.,-(tempNormal.y/tempNormal.z));

    vec3 tangentTransformed = (view_mat * model_mat
         * vec4(normalize(tangent),0.)).xyz;

    vec3 binormalTransformed = (view_mat * model_mat
         * vec4(normalize(binormal),0.)).xyz;

    tempNormal.xyz = (view_mat * model_mat * vec4(tempNormal.xyz,0.)).xyz;

    float tangentProjection = dot(tangentTransformed,view_dir);
    float binormalProjection = dot(binormalTransformed,view_dir);

    vec2 textureOffset = vec2(tangentProjection,binormalProjection)*height.x/fSpeed;

    //textureOffset = vec2(0.);

    vec2 realTexturePosition = texturePosition + textureOffset;


    tempNormal = texture2D(normalTexture,realTexturePosition);
    //tempNormal.xyz = normalize(tempNormal.xyz*2. - 1.);
    tempNormal.xyz = normalize(vec3(tempNormal.xy - 128./255.,tempNormal.z));

    vec3 normal = (view_mat * model_mat * vec4(tempNormal.xyz,0.)).xyz;

    vec4 textureColor = texture2D(baseTexture,realTexturePosition);

    vec4 mat_emissive = textureColor;
    vec4 mat_ambient = textureColor;
    vec4 mat_diffuse = textureColor;
    vec4 mat_specular = textureColor;
    float mat_shininess = 45.;

    LIGHTPOINT light_point;
    light_point.position = view_mat * model_mat *vec4(light_position,1.);//vec4(0., 20., 10., 1.);
    light_point.ambient = vec4(1., 1., 1., 1.);
    light_point.diffuse  =vec4(1., 1., 1., 1.);
    light_point.specular = vec4(1., 1., 1., 1.);
    light_point.attenuation = vec3(1., 0.04, .0001);


    vec3 light_dir = light_point.position.xyz - vertex;
    float light_dir_length = length(light_dir);
    light_dir = normalize(light_dir);
    
    // length from source of light to vert
    vec3 light_distance = normalize(reflect(-light_dir, normal));

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
    color += mat_diffuse * light_point.diffuse * max(dot(normal, light_dir), .0) * attenuation;
    //color *= serial;

    // add reflect lighting
    //float light_distancedotVpow = max(pow(dot(light_distance, view_dir), mat_shininess), 0.0);
    float light_distancedotVpow = pow(max(dot(light_distance, view_dir), .0), mat_shininess);
    color += mat_specular * light_point.specular * light_distancedotVpow * attenuation;


    gl_FragColor = color;
    //gl_FragColor = vec4(normal,1.);
}
