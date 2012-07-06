#include "decode_texture.glsl"

uniform sampler2D dataTexture;
uniform float POSITION_INDEX_OFFSET;
uniform float VELOCITY_INDEX_OFFSET;
uniform float dt;

attribute float INDEX_UPDATE;

varying vec4 updatedPosition;

vec2 function screenPosition(A_TextureHeader vb_header,float index){
	float pixelIndex = floor(index/4.);
	return vec2(2.*(mod(pixelIndex,vb_header.width) + 0.5)/vb_header.stepX - 1.,2.*(floor(pixelIndex/vb_header.width) + 0.5)/vb_header.stepY - 1.);
}

void main(void){
	A_TextureHeader vb_header;
	A_extractTextureHeader(dataTexture, vb_header);
	
	vec4 velocity = A_extractVec4(dataTexture, vb_header, INDEX_UPDATE + VELOCITY_INDEX_OFFSET);

	updatedPosition = A_extractVec4(dataTexture, vb_header, INDEX_UPDATE + POSITION_INDEX_OFFSET);
	updatedPosition.xyz += velocity.xyz*dt;

	gl_Position = vec4(screenPosition(vb_header,INDEX_UPDATE + POSITION_INDEX_OFFSET));
}

//<-- split -- >

#ifdef GL_ES                    
    precision highp float;      
#endif           

varying vec4 updatedPosition;

void main(void){
	gl_FragColor = updatedPosition;
}