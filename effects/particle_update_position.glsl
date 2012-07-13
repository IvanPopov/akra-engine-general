#include "decode_texture.glsl"

uniform sampler2D A_buffer_0;
uniform float INDEX_PARTICLE_POSITION_OFFSET;
uniform float INDEX_PARTICLE_VELOCITY_OFFSET;
uniform float INDEX_LIVE_TIME_OFFSET;
uniform float dt;
uniform float t;

attribute float INDEX_UPDATE;

varying vec4 updatedPosition;

vec2 screenPosition(A_TextureHeader vb_header,float index){
	float pixelIndex = floor(index/4.);
	return vec2(2.*(mod(pixelIndex,vb_header.width) + 0.5)*vb_header.stepX - 1.,2.*(floor(pixelIndex/vb_header.width) + 0.5)*vb_header.stepY - 1.);

	//return vec2(2.*(mod(2.,vb_header.width) + 0.5)*vb_header.stepX - 1.,2.*(floor(2./vb_header.width) + 0.5)/vb_header.stepY - 1.);
}

void main(void){
	A_TextureHeader vb_header;
	A_extractTextureHeader(A_buffer_0, vb_header);
	
	vec4 velocity = A_extractVec4(A_buffer_0, vb_header, INDEX_UPDATE + INDEX_PARTICLE_VELOCITY_OFFSET);

	float fLiveTime = A_extractFloat(A_buffer_0, vb_header, INDEX_UPDATE + INDEX_LIVE_TIME_OFFSET);

	updatedPosition = A_extractVec4(A_buffer_0, vb_header, INDEX_UPDATE + INDEX_PARTICLE_POSITION_OFFSET);
	updatedPosition.xyz += velocity.xyz*dt;


	float fRealTime = mod(t,fLiveTime);
	float fNewTime = mod(t+dt,fLiveTime);

	if(updatedPosition.y < 0.){
		updatedPosition.y = 0.;
	}
	if(fRealTime + dt >= fLiveTime){
		updatedPosition.xyz = vec3(0.);	
	}


	gl_Position = vec4(screenPosition(vb_header,INDEX_UPDATE + INDEX_PARTICLE_POSITION_OFFSET),0.,1.);
}

//<-- split -- >

#ifdef GL_ES                    
    precision highp float;      
#endif           

varying vec4 updatedPosition;

void main(void){
	gl_FragColor = updatedPosition;
}