//#define INDEX_POSITION INDEX0

attribute vec3 POSITION;
attribute vec3 COLOR;
//uniform float INDEX_POSITION_OFFSET;

uniform mat4 model_mat;
uniform mat4 view_mat;
uniform mat4 proj_mat;

varying vec3 color;

void main(void) {
    color = COLOR;
	gl_Position = proj_mat * view_mat * model_mat * vec4(POSITION,1.);
}

//<-- split -- >

#ifdef GL_ES                    
    precision highp float;      
#endif

varying vec3 color;

void main(void) {
    gl_FragColor = vec4(color, 1.);
}