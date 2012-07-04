attribute vec2 POSITION;

varying vec2 texpos;

void main(void) {
    texpos = (POSITION + 1.) / 2.;
	gl_Position = vec4(POSITION,0.,1.);
}

//<-- split -- >

#ifdef GL_ES                    
    precision highp float;      
#endif                          

uniform sampler2D src;

varying vec2 texpos;

void main(void) {
    gl_FragColor = texture2D(src, texpos);
}