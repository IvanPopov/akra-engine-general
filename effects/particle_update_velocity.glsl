#include "decode_texture.glsl"

uniform sampler2D A_buffer_0;
//uniform float POSITION_INDEX_OFFSET;
uniform float INDEX_PARTICLE_VELOCITY_OFFSET;
uniform float INDEX_PARTICLE_POSITION_OFFSET;
uniform float INDEX_LIVE_TIME_OFFSET;
uniform float dt;
uniform float t;
uniform vec3 v3fRand;

attribute float INDEX_UPDATE;

varying vec4 updatedVelocity;

vec3 calculateAcceleration(){
	return vec3(0.,-5.,0.);
}

vec2 screenPosition(A_TextureHeader vb_header,float index){
	float pixelIndex = floor(index/4.);
	return vec2(2.*(mod(pixelIndex,vb_header.width) + 0.5)*vb_header.stepX - 1.,2.*(floor(pixelIndex/vb_header.width) + 0.5)*vb_header.stepY - 1.);
}

float rand(vec2 co,vec2 v2fRand){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233) + v2fRand)) * 43758.5453) - 0.5;
}

void main(void){
	A_TextureHeader vb_header;
	A_extractTextureHeader(A_buffer_0, vb_header);
	
	vec4 position = A_extractVec4(A_buffer_0, vb_header, INDEX_UPDATE + INDEX_PARTICLE_POSITION_OFFSET);


	float fLiveTime = A_extractFloat(A_buffer_0, vb_header, INDEX_UPDATE + INDEX_LIVE_TIME_OFFSET);

	float fRealTime = mod(t,fLiveTime);
	float fNewTime = mod(t+dt,fLiveTime);

	if(fRealTime + dt >= fLiveTime){
		updatedVelocity.xyz = 5.*vec3(4.*rand(position.xy,v3fRand.xy),5. + 2.*rand(position.yz,v3fRand.yz),4.*rand(position.zx,v3fRand.zx));
		//updatedVelocity.xyz = 5.*vec3(rand(position.xy,vec2(0.)),5. + 2.*rand(position.yz,vec2(0.)),rand(position.zx,vec2(0.)));
	}
	else{
		updatedVelocity = A_extractVec4(A_buffer_0, vb_header, INDEX_UPDATE + INDEX_PARTICLE_VELOCITY_OFFSET);
		updatedVelocity.xyz += calculateAcceleration()*dt;
	}

	gl_Position = vec4(screenPosition(vb_header,INDEX_UPDATE + INDEX_PARTICLE_VELOCITY_OFFSET),0.,1.);
}

//<-- split -- >

#ifdef GL_ES                    
    precision highp float;      
#endif           

varying vec4 updatedVelocity;

void main(void){
	gl_FragColor = updatedVelocity;
}