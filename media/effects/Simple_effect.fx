struct VS_INPUT{
	float3 pos:POSITION;
};
struct VS_OUTPUT{
	float4 pos:POSITION;
};
float3 col:COLOR = {1.0,0.5,0.8};
float scale = 1.0;

VS_OUTPUT mainVS(VS_INPUT IN){
	VS_OUTPUT Out;
	Out.pos = float4(IN.pos*scale,1.0);
	return Out;
}
float4 mainFS(VS_OUTPUT IN) : COLOR{
	return float4(col,1.0);
}
technique akra.base.simple{
	pass P0{
		VertexShader = compile vs_1_1 mainVS();
        PixelShader  = compile ps_2_0 mainFS();
	}
}
