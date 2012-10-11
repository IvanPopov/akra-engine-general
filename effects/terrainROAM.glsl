#include "decode_texture.glsl"

attribute float INDEX_INDEX0;

uniform mat4 model_mat;
uniform mat4 view_mat;
uniform mat4 proj_mat;

uniform sampler2D A_buffer_0;

varying vec2 texcoord;
varying vec3 edgeTest;

void main(void) {
	A_TextureHeader vb_header;
	A_extractTextureHeader(A_buffer_0, vb_header);

	 vec4 ambient_light = vec4(0.5, 0.5, 0.7, 0.0);
     vec4 sun_vec = vec4(0.578, 0.578, 0.578, 0.0);

    float iPosition = A_extractFloat(A_buffer_0, vb_header, INDEX_INDEX0);
	vec3 position = A_extractVec3(A_buffer_0, vb_header, iPosition );
	texcoord = A_extractVec2(A_buffer_0, vb_header, iPosition + 3.);


	vec4 pos = model_mat * vec4(position, 1.);

	if(mod(INDEX_INDEX0,3.) == 0.){
	    edgeTest = vec3(1.,0.,0.);
	}
	else if(mod(INDEX_INDEX0,3.) == 1.){
	    edgeTest = vec3(0.,1.,0.);
	}
	else{
	    edgeTest = vec3(0.,0.,1.);
	}

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

uniform sampler2D textureTerrain0;
uniform sampler2D textureTerrain1;
uniform sampler2D textureTerrain2;
uniform sampler2D textureTerrain3;
uniform sampler2D textureTerrain4;
uniform sampler2D textureTerrain5;

uniform sampler2D ptNormal;


uniform bool textureTerrainIsLoaded0;
uniform bool textureTerrainIsLoaded1;
uniform bool textureTerrainIsLoaded2;
uniform bool textureTerrainIsLoaded3;
uniform bool textureTerrainIsLoaded4;
uniform bool textureTerrainIsLoaded5;


uniform vec2 cameraCoordTerrain;
varying vec2 texcoord;
varying vec3 edgeTest;

void main(void)
{
    vec4 color;
    vec2 new_texcoord;
    vec3 normal;

    new_texcoord = (texcoord-cameraCoordTerrain)*32.+vec2(0.5);
    if(textureTerrainIsLoaded5&&(new_texcoord.x>=0.&&new_texcoord.x<1.&&new_texcoord.y>=0.&&new_texcoord.y<1.0))
    {
        color = texture2D(textureTerrain5,new_texcoord);
    }
    else
    {
        new_texcoord = (texcoord-cameraCoordTerrain)*16.+vec2(0.5);
        if(textureTerrainIsLoaded4&&(new_texcoord.x>=0.&&new_texcoord.x<1.&&new_texcoord.y>=0.&&new_texcoord.y<1.0))
        {
            color = texture2D(textureTerrain4,new_texcoord);
        }
        else
        {
            new_texcoord = (texcoord-cameraCoordTerrain)*8.+vec2(0.5);
            if(textureTerrainIsLoaded3&&(new_texcoord.x>=0.&&new_texcoord.x<1.&&new_texcoord.y>=0.&&new_texcoord.y<1.0))
            {
                color = texture2D(textureTerrain3,new_texcoord);
            }
            else
            {
                new_texcoord = (texcoord-cameraCoordTerrain)*4.+vec2(0.5);
                if(textureTerrainIsLoaded2&&(new_texcoord.x>=0.&&new_texcoord.x<1.&&new_texcoord.y>=0.&&new_texcoord.y<1.0))
                {
                    color = texture2D(textureTerrain2,new_texcoord);
                }
                else
                {
                    new_texcoord = (texcoord-cameraCoordTerrain)*2.+vec2(0.5);
                    if(textureTerrainIsLoaded1&&(new_texcoord.x>=0.&&new_texcoord.x<1.&&new_texcoord.y>=0.&&new_texcoord.y<1.0))
                    {
                        color = texture2D(textureTerrain1,new_texcoord);
                    }
                    else
                    {
                        color= texture2D(textureTerrain0,texcoord);
                    }
                }
            }
        }
    }

    normal=texture2D(ptNormal,texcoord).rgb;
    normal.xy -= 0.5;
    normal = normalize(normal);

    vec4 ambient_light = vec4(0.5, 0.5, 0.7, 0.0);
    vec4 sun_vec = vec4(0.578, 0.578, 0.578, 0.0);
    vec4 diffuse = dot(normal, sun_vec.rgb) + ambient_light;

    color=color*diffuse;

//    if(edgeTest.x*edgeTest.y*edgeTest.z <= 0.001 ){
//        color = vec4(0.);
//    }
    color.a =1.;
    gl_FragColor = color;
}

