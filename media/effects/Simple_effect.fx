video_buffer buf0:BUFFER;
video_buffer buf1;

texture tex0 : TEXTURE1;
texture tex1 : TEXTURE2;

sampler LinearSamp0:SAMPLER = sampler_state {
    Texture = <tex0>;
    AddressU  = clamp;
    AddressV  = clamp;
    AddressW  = clamp;
    MIPFILTER = LINEAR;
    MINFILTER = LINEAR;
    MAGFILTER = LINEAR;
};

sampler LinearSamp1 = sampler_state {
    Texture = <tex1>;
    AddressU  = wrap;
    AddressV  = wrap;
    AddressW  = wrap;
    MIPFILTER = LINEAR;
    MINFILTER = LINEAR;
    MAGFILTER = LINEAR;
};
struct VS_INPUT{
	float3 pos:POSITION;
};
struct VS_OUTPUT{
	float4 pos:POSITION;
	float4 col:COLOR;
};

float col:COLOR1 = 1.0;
float scale = 0.0;

VS_OUTPUT mainVS(VS_INPUT IN){
	VS_OUTPUT Out;
	float t[](buf0);
	Out.col = tex2D(LinearSamp0, float2(0.5,0.5));
	Out.pos = float4(IN.pos*scale,1.0);
	return Out;
}
float4 mainFS(VS_OUTPUT IN) : COLOR{
    float t[](buf1);
    //col = float3(1.0,0.5,0.0);
	return IN.col + tex2D(LinearSamp1, float2(col, scale));
}
technique akra.base.simple{
	pass P0{
		VertexShader = compile vs_1_1 mainVS();
        PixelShader  = compile ps_2_0 mainFS();
	}
}
