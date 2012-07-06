#include "decode_texture.glsl"

attribute float INDEX_POSITION;
attribute float INDEX_NORMAL;

uniform mat4 model_mat;
uniform mat4 view_mat;
uniform mat4 proj_mat;
uniform sampler2D A_buffer_0;

varying vec3 texcoord;

void main(void) {
	A_TextureHeader vb_header;
	A_extractTextureHeader(A_buffer_0, vb_header);

	vec3 position = A_extractVec3(A_buffer_0, vb_header, INDEX_POSITION);
	vec3 normal = A_extractVec3(A_buffer_0, vb_header, INDEX_NORMAL);
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
    gl_FragColor = vec4(.0, .0, .0, .0);

    float len = length(texcoord);
    float alpha = 1.;// - len / 8.;
    float a1, a2;
    
    if (abs(texcoord.x) < 0.015)
        gl_FragColor = vec4(1., 0., 0., alpha);
    else if(abs(texcoord.z) < 0.015)
        gl_FragColor = vec4(0., 1., 0., alpha);
    else {
    
        a1 = abs(len - floor(texcoord.x / .25) * len);
        a2 = abs(len - floor(texcoord.z / .25) * len);
        //if (a1 < .01) {
        //    gl_FragColor = vec4(.0, .0, .0, 0.6);
        //}
        //else if (a2 < .01) {
        //    gl_FragColor = vec4(.0, .0, .0, 0.6);
        //}
        //else
        //{
        
            float x = abs(texcoord.x);
            float y = abs(texcoord.z);
            float   dx = (x - float(int((x)))), 
                    dy = (y - float(int((y))));
            if (.02 > dx)
            {
                dx = 4.;//exp2(-100000. * pow(dx, 2.5));
                gl_FragColor = vec4(.2, .2, .2, .7) * dx;
            }
            else if (.02 > dy)
            {
                dy = 4.;//exp2(-100000. * pow(dy, 2.5));
                gl_FragColor = vec4(.2, .2, .2, .7) * dy;
            }
            else
            discard;
        //}
    }
}