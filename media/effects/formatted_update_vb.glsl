struct VS_OUT_0_1{
	vec4 VARCOLOR;
	vec4 POSITION;
};
struct VS_IN_0_1{
	float INDEX;
	float SHIFT;
	vec4 VALUE;
};

uniform sampler2D A_s_0;
uniform vec2 size_0_1;

varying vec4 VARCOLOR;

attribute float A_a_0;
attribute float A_a_1;
attribute vec4 A_a_2;

float INDEX;
float SHIFT;
vec4 VALUE;

struct { 
	vec4 POSITION;
	vec4 VARCOLOR;
} Out;

void vertex_main_2_1(){
	{
		int offset_11_1=int(SHIFT);
		if(offset_11_1 != 0)
		{
			Out.VARCOLOR=texture2D((A_s_0),(vec2((mod((INDEX),(size_0_1.x)) + 0.5) / size_0_1.x,(floor((INDEX / size_0_1.x)) + 0.5) / size_0_1.y)));
			if(offset_11_1 == 1)
			{
				Out.VARCOLOR=vec4(Out.VARCOLOR.r,VALUE.gba);
			}else if(offset_11_1 == 2)
			{
				Out.VARCOLOR=vec4(Out.VARCOLOR.rg,VALUE.ba);
			}else if(offset_11_1 == 3)
			{
				Out.VARCOLOR=vec4(Out.VARCOLOR.rgb,VALUE.a);
			}else if(offset_11_1 == -1)
			{
				Out.VARCOLOR=vec4(VALUE.r,Out.VARCOLOR.gba);
			}else if(offset_11_1 == -2)
			{
				Out.VARCOLOR=vec4(VALUE.rg,Out.VARCOLOR.ba);
			}	
			else 
			{
				Out.VARCOLOR=vec4(VALUE.rgb,Out.VARCOLOR.a);
			}
		}else {
			Out.VARCOLOR=VALUE;
		}
		
		Out.POSITION=vec4(2. * (mod((INDEX),(size_0_1.x)) + 0.5) / size_0_1.x - 1.,
			2. * (floor((INDEX / size_0_1.x)) + 0.5) / size_0_1.y - 1.,0.,1.);
		return;
	}
}

void main(){
	INDEX = A_a_0;
	SHIFT = A_a_1;
	VALUE = A_a_2;
	
	vertex_main_2_1();
	
	VARCOLOR = Out.VARCOLOR;
	
	gl_Position = Out.POSITION;
} 