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

varying vec3 v3fT;
varying vec3 v3fN;
varying vec3 v3fB;

void main(void) {
    A_TextureHeader vb_header;
    A_extractTextureHeader(A_buffer_0, vb_header);

    texturePosition = TEXTURE_POSITION;

    vec4 pos = view_mat * model_mat * (vec4(CENTER_POSITION, 1.) + vec4(POSITION_OFFSET,0.,0.));
    vertex = pos.xyz;

    v3fT = vec3(1.,0.,0.);
    v3fB = vec3(0.,1.,0.);
    v3fN = vec3(0.,0.,1.);

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
//uniform int iSteps;
const int iSteps = 5;

uniform float fBumpScale;

uniform vec3 light_position;

varying vec2 texturePosition;

varying vec3 vertex;

varying vec3 v3fT;
varying vec3 v3fN;
varying vec3 v3fB;

struct LIGHTPOINT {
    vec4 position;
    vec4 ambient;
    vec4 diffuse;
    vec4 specular;
    vec4 emissive;
    vec3 attenuation;
};

vec4 mat_emissive;
vec4 mat_ambient;
vec4 mat_diffuse;
vec4 mat_specular;
float mat_shininess;

float fSteps;

void main(void) {

    vec3 view_dir = normalize(eye_pos - vertex);

    vec3 tangent = (view_mat * model_mat * vec4(normalize(v3fT),0.)).xyz;
    vec3 binormal = (view_mat * model_mat * vec4(normalize(v3fB),0.)).xyz;
    vec3 normal = (view_mat * model_mat * vec4(normalize(v3fN),0.)).xyz;

    vec3 tsView = vec3( dot(tangent,view_dir),
                        dot(binormal,view_dir),
                        dot(normal,view_dir)); //разложение видового вектора по базису

    fSteps = mix(float(iSteps)*2., float(iSteps), tsView.z);

    vec2 realTexturePosition = texturePosition;

    ////////////////////////////////////////////////

    float fSurfaceHeight = texture2D(heightTexture,realTexturePosition).x;

    float height = 1.;

    float step;
    vec2 delta;

    step = 1./float(iSteps);
    delta = vec2(-tsView.x,tsView.y)*fBumpScale/(tsView.z * fSteps);

    for(int i=0; i<100;i++){
        if(fSurfaceHeight >= height || float(i) >= fSteps){
            break;
        }
        height -= step;
        realTexturePosition += delta;
        fSurfaceHeight = texture2D(heightTexture,realTexturePosition).x;
    }

    normal = texture2D(normalTexture,realTexturePosition).xyz;
    normal = 2.*normal - 1.;
    normal = (view_mat * model_mat * vec4(normal,0.)).xyz;

    /////////////////////////////////////////////////

    vec4 textureColor = texture2D(baseTexture,realTexturePosition);

    mat_emissive = textureColor;
    mat_ambient = textureColor;
    mat_diffuse = textureColor;
    mat_specular = textureColor;
    mat_shininess = 45.;

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

    /////////////////////////////////////////////////////////////////

    float selfShadow = 0.;

    vec3 tsLighting = vec3( dot(tangent,light_dir),
                            dot(binormal,light_dir),
                            dot(normal,light_dir)); //разложение направления на источник по базису;

    if(dot(normal,tsLighting) > 0.){
        float fNumShadowSteps = mix(60.,5.,tsLighting.z);
        step = 1./fNumShadowSteps;
        delta = vec2(tsLighting.x,-tsLighting.y)*fBumpScale/(fNumShadowSteps * tsLighting.z);

        height = fSurfaceHeight + step*0.1;

        for(int i=0;i<100;i++){
            if(fSurfaceHeight >= height || height >= 1.){
                break;
            }

            height += step;
            realTexturePosition += delta;

            fSurfaceHeight = texture2D(heightTexture,realTexturePosition).x; 
        }

        if(fSurfaceHeight < height){
            selfShadow = 1.;
        }
    }


    gl_FragColor = color/1.3;
    gl_FragColor.rgb *= selfShadow;
}
