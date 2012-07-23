//
// Example of effect file.
// Source code from multipass_terrain.fx from Real-Time 3D Terrain Engines
//

use strict;
video_buffer buf0;
// transformations
float4x4 mViewProj: VIEWPROJECTION;

float4 posOffset : posScaleOffset = {1.0, 1.0, 0.0f, 0.0f};
float4 texOffset : uvScaleOffset = {1.0, 1.0, 0.0f, 0.0f};

float4 ambient_light = {0.3f,0.3f,0.6f,0.0f};
float4 sun_vec: sunlight_vec = {0.578f,0.578f,0.578f,0.0f};

texture tex0 : TEXTURE1; // blend
texture tex1 : TEXTURE2; // surface 0
texture tex2 : TEXTURE3; // surface 1
texture tex3 : TEXTURE4; // surface 2
texture tex4 : TEXTURE5; // surface 3
texture tex5 : TEXTURE6; // noise channels

struct VS_INPUT
{
  float2	Pos		: POSITION0;
  float2	UV		: TEXCOORD0;
  float	ZPos		: POSITION1;
  float3	Norm[][]	: NORMAL;
};

float a1, a2 = 3.0, a3;

struct VS_OUTPUT11
{
    float4 Pos  : POSITION;
    float4 vDiffuse  : COLOR0;
    float2 vTex0  : TEXCOORD0;
    float2 vTex1  : TEXCOORD1;
    float2 vTex2  : TEXCOORD2;
    float2 vTex3  : TEXCOORD3;
};

struct VS_OUTPUT14
{
    float4 Pos  : POSITION;
    float4 vDiffuse  : COLOR0;
    float2 vTex0  : TEXCOORD0;
    float2 vTex1  : TEXCOORD1;
    float2 vTex2  : TEXCOORD2;
    float2 vTex3  : TEXCOORD3;
    float2 vTex4  : TEXCOORD4;
    float2 vTex5  : TEXCOORD5;
};
float3 testFunc0(float3 pos[]);

float4 testFunc(inout float x){
	return float4(testFunc0(float3(x+a2)),4.0);
}
float3 testFunc0(float3 pos123[]){
	a3 = 10.;
	return pos123;
}
struct testStruct0{
	float3 dif;
	float3 amb[];
};
struct testStruct1{
	float a;
	float3 pos[][];
	float3 norm[][];
	testStruct0 mat[10][][];
};

sampler LinearSamp1 = sampler_state
{
    Texture = <tex1>;
    AddressU  = wrap;
    AddressV  = wrap;
    AddressW  = wrap;
    MIPFILTER = LINEAR;
    MINFILTER = LINEAR;
    MAGFILTER = LINEAR;
};
float abc1 = 10;
struct VS_OUT 
{
	float4 Pos  : POSITION;
	float dif : COLOR10;
};

VS_OUTPUT11 VS11(uniform testStruct1 T, VS_INPUT v)
{
	VS_OUTPUT11 Out;
	VS_INPUT v1 = v;
	float4 combinedPos = float4(
		v.Pos.x,
		v.Pos.y,
		v.ZPos,
		1);
	testStruct1 t1;
	t1.pos(memof v.Norm);
	@@(t1.pos)+=10;
    //float4 pos = (((Out).Pos).xyzw + float4(1.0,2.0,3.0,4.0)).rab;
	float2 xy = testFunc(1.0).zw;
	ptr abc = @@(v.Norm)++;
	abc = abc1;
	abc1 = 5;
	combinedPos.xy = posOffset.zw;
	if(v.Pos.x > 0.){
		Out.Pos = mul(combinedPos, mViewProj);	
	}
	else if(v.Pos.y > 0. && v.Pos.x == 0.){
		Out.Pos = mul(combinedPos, mViewProj);
		if(true){
			int x = 10;
			x = 40;
		}
		else{
			int x = 20;
		}
	}
	else {
		Out.Pos = mul(combinedPos, mViewProj);
	}
	//Out.Pos = mul(combinedPos, mViewProj);  // position (view space)

	Out.vDiffuse = (float4)dot(v.Norm, sun_vec.rgb) + ambient_light;

	Out.vTex0 = (v.UV+texOffset.zw)*texOffset.xy;
	Out.vTex1 = v.UV*2.0f;
	Out.vTex2 = v.UV*2.0f;
	Out.vTex3 = v.UV*0.7f; // tile the noise UVs at a different rate
    return ((Out));
}

VS_OUTPUT14 VS14(const VS_INPUT v)
{
	VS_OUTPUT14 Out;
	
	float4 combinedPos = float4(
		v.Pos.x,
		v.Pos.y,
		v.ZPos,
		1);

	combinedPos.xy = posOffset.zw;

	Out.Pos = mul(combinedPos, mViewProj);  // position (view space)

	Out.vDiffuse = dot(v.Norm, sun_vec.rgb)+ ambient_light;

	Out.vTex0 = (v.UV+texOffset.zw)*texOffset.xy;
	Out.vTex1 = v.UV;
	Out.vTex2 = v.UV;
	Out.vTex3 = v.UV;
	Out.vTex4 = v.UV;
	Out.vTex5 = v.UV*1.7f; // tile the noise UVs at a different rate

    return Out;
}
VS_OUT VS10(float2 pos:POSITION, float zpos: POSITION0)
{
	VS_OUT Out;
	Out.Pos = float4(pos.x, pos.y, zpos, 1.);
	return Out;
}
sampler LinearSamp0 = sampler_state
{
    Texture = <tex0>;
    AddressU  = clamp;
    AddressV  = clamp;
    AddressW  = clamp;
    MIPFILTER = LINEAR;
    MINFILTER = LINEAR;
    MAGFILTER = LINEAR;
};



sampler LinearSamp2 = sampler_state
{
    Texture = <tex2>;
    AddressU  = wrap;
    AddressV  = wrap;
    AddressW  = wrap;
    MIPFILTER = LINEAR;
    MINFILTER = LINEAR;
    MAGFILTER = LINEAR;
};

sampler LinearSamp3 = sampler_state
{
    Texture = <tex3>;
    AddressU  = wrap;
    AddressV  = wrap;
    AddressW  = wrap;
    MIPFILTER = LINEAR;
    MINFILTER = LINEAR;
    MAGFILTER = LINEAR;
};

sampler LinearSamp4 = sampler_state
{
    Texture = <tex4>;
    AddressU  = wrap;
    AddressV  = wrap;
    AddressW  = wrap;
    MIPFILTER = LINEAR;
    MINFILTER = LINEAR;
    MAGFILTER = LINEAR;
};

sampler LinearSamp5 = sampler_state
{
    Texture = <tex5>;
    AddressU  = wrap;
    AddressV  = wrap;
    AddressW  = wrap;
    MIPFILTER = LINEAR;
    MINFILTER = LINEAR;
    MAGFILTER = LINEAR;
};

float4 FourSurfaceBlend(VS_OUTPUT14 In) : COLOR
{
	// sample all four textures
	float4 BlendControler = tex2D(LinearSamp0, In.vTex0 );
	float4 texColor0 = tex2D(LinearSamp1, In.vTex1 );
	float4 texColor1 = tex2D(LinearSamp2, In.vTex2 );
	float4 texColor2 = tex2D(LinearSamp3, In.vTex3 );
	float4 texColor3 = tex2D(LinearSamp4, In.vTex4 );
	float4 noise = tex2D(LinearSamp5, In.vTex5 );

	// apply our noise to the blend
	BlendControler = BlendControler*noise;

	// determine the amount of each surface to blend
	float4 Color0 = (texColor0 * BlendControler.r);
	float4 Color1 = (texColor1 * BlendControler.g);
	float4 Color2 = (texColor2 * BlendControler.b);
	float4 Color3 = (texColor3 * BlendControler.a);

	// sum the resulting colors
	// and multiply by the diffuse
	// vertex color
	return (Color0 + Color1 + Color2 + Color3)*In.vDiffuse;
}

float4 TwoSurfacePass0(VS_OUTPUT11 In) : COLOR
{
	const  float4 vC0 =float4(1.0f,0.0f,0.0f,0.0f);
	const  float4 vC1 =float4(0.0f,0.0f,1.0f,0.0f);

	float4 t0 = tex2D(LinearSamp0, In.vTex0 );
	float4 t1 = tex2D(LinearSamp1, In.vTex1 );
	float4 t2 = tex2D(LinearSamp3, In.vTex2 );
	float4 t3 = tex2D(LinearSamp5, In.vTex3 );

	t2= t2* dot((t0* t3), vC1);
	t1= t1* dot((t0* t3), vC0);

	return (t1+ t2)* In.vDiffuse;
}

float4 TwoSurfacePass1(VS_OUTPUT11 In) : COLOR
{
	const  float4 vC0 =float4(0.0f,1.0f,0.0f,0.0f);
	const  float4 vC1 =float4(0.0f,0.0f,0.0f,1.0f);

	float4 t0 = tex2D(LinearSamp0, In.vTex0 );
	float4 t1 = tex2D(LinearSamp2, In.vTex1 );
	float4 t2 = tex2D(LinearSamp4, In.vTex2 );
	float4 t3 = tex2D(LinearSamp5, In.vTex3 );

	t1= t1* dot((t0*t3), vC0);
	t2= t2* dot((t0*t3), vC1);

	return (t1+ t2)* In.vDiffuse;
}
int c = 10;
technique MultiPassTerrain
{
    pass P0
    {
			if(engine.cull[c].xy == 100 && true){
				CULLMODE = CW;
				VertexShader = compile vs_1_1 VS10();
			}
			else{
				CULLMODE = CW;
			}
			ZENABLE = TRUE;
			ZWRITEENABLE = TRUE;
			ZFUNC = LESSEQUAL;

			AlphaBlendEnable = false;
			AlphaTestEnable = false;

      // shaders
      VertexShader = compile vs_1_1 VS11();
      PixelShader = compile ps_1_1 TwoSurfacePass0();
    }

    pass P1
    {
			CULLMODE = CW;
			ZENABLE = TRUE;
			ZWRITEENABLE = FALSE;
			ZFUNC = LESSEQUAL;

			AlphaTestEnable = false;
			AlphaBlendEnable = true;

      // shaders
      VertexShader = compile vs_1_1 VS11();
      PixelShader = compile ps_1_1 TwoSurfacePass1();
    }
}

technique SinglePassTerrain
{
    pass P0
    {
			//FILLMODE = WIREFRAME;
			CULLMODE = CW;
			ZENABLE = TRUE;
			ZWRITEENABLE = TRUE;
			ZFUNC = LESSEQUAL;

			AlphaBlendEnable = false;

        // shaders
        VertexShader = compile vs_1_1 VS14();
        PixelShader  = compile ps_2_0 FourSurfaceBlend();
    }
}
