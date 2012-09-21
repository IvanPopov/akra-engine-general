attribute vec2 POSITION;
varying vec2 texturePosition;

void main(void){
    texturePosition = (POSITION + vec2(1.))/2.;
    gl_Position = vec4(POSITION,0.,1.);
}

//<-- split -- >

#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D texture;
varying vec2 texturePosition;

void main(void){
    gl_FragColor = texture2D(texture,texturePosition);
}