texture sourceTexture : TEXTURE;

sampler sourceSampler  = sampler_state
{
    texture = <sourceTexture>;
    AddressU  = clamp;
    AddressV  = clamp;
    MIPFILTER = NEAREST;
    MINFILTER = NEAREST;
    MAGFILTER = NEAREST;
};

struct VS_OUTPUT
{
    float4 pos     : POSITION;
    float4 color   : COLOR;
};

VS_OUTPUT VS(float4 value:VALUE, int index:INDEX, int shift:SHIFT, uniform float2 size)
{
    VS_OUTPUT   o;
    float  serial = float(index);
    float4 color = tex2D(sourceSampler, float2(mod(serial, size.x) / size.x, floor(serial / size.x) / size.y));

    int from = 0, to = 4;

    if (shift != 0) {
        if (shift < 0) {
            from = 4 + shift;
        }
        else {
            to = shift;
        }

        for (int i = from; i < to; i++) {
            value[i] = color[i]
        }
    }

    o.color = value;
    o.pos   = serial;

    return o;
}

float4 PS(VS_OUTPUT i) : COLOR
{
    return i.color;
}

technique UpdateTexture
{
	pass P0
	{
		CULLMODE = CCW;
		ZENABLE = TRUE;
		ZWRITEENABLE = TRUE;
		ZFUNC = LESSEQUAL;

		// shaders
		VertexShader = compile VS();
		PixelShader  = compile PS();
	}
}