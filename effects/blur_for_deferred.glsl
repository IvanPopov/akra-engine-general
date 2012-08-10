
attribute vec2 POSITION;

varying vec2 texturePosition;

void main(void) {
    texturePosition = (POSITION+1.)/2.;
	gl_Position = vec4(POSITION,0.,1.);
}

//<-- split -- >

#ifdef GL_ES                    
    precision highp float;      
#endif                          

uniform sampler2D deferredTexture;
uniform vec2 reverseTextureSizes;

varying vec2 texturePosition;

void main(void) {
    float alpha = 0.;
    float weight;
    float weight_sum = 0.;
    const int blur_radius = 1;//строго говоря сторона квадрата

    vec4 color = vec4(0.);

    color = texture2D(deferredTexture,vec2(texturePosition));
    float number = 0.;
    if(color != vec4(0.)){
        for(int i = -blur_radius; i<= blur_radius; i++){
            for(int j = -blur_radius; j<= blur_radius; j++){
                vec4 color_temp = texture2D(deferredTexture,vec2(texturePosition) + vec2(float(i),float(j))*reverseTextureSizes);
                if(color_temp == vec4(0.)){
                    number++;
                }
            }
        }
        color.w = 1. - number/9.;
        gl_FragColor = color.w * vec4(color.xyz,1.) + (1. - color.w)*vec4(0.5,0.5,0.5,1.);
    }
    else{
        discard;
    }

}