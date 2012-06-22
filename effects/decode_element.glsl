

vec3 getvec3(sampler2D Sampler, float iOffset) //14
{
	float width  = texture2D(Sampler,vec2(0.,0.)).g;//4
	float height = texture2D(Sampler,vec2(0.,0.)).b;//4
	
	float shift = mod(iOffset, iPixelSize);//2
	
	float w_stride;
	float h_stride;	
	
	float y = floor(floor(iOffset / iPixelSize)/ width);	//0 
	float x = mod(floor(iOffset / iPixelSize), width);		//3  
	
	w_stride = 1. / width;
	h_stride = 1. / height;
	
#ifdef __tex_component_4__

    if(int(shift) == 0)
    {
        return texture2D(Sampler, vec2(w_stride * x, 1. -h_stride * y)).rgb;
    }
    else if(int(shift) == 1)
    {
        return texture2D(Sampler, vec2(w_stride * x, 1. - h_stride * y)).gba;
    }
    else if(int(shift) == 2)
    {
        if(x == width - 1.)
        {
            //if(y==0.&&x==3.)
			//{
			//	return vec3(texture2D(Sampler, vec2(w_stride * x, h_stride * y)).ba, texture2D(Sampler, vec2(0., 1./4.)).r);
			//}
			//else
			//{
				return vec3(texture2D(Sampler, vec2(w_stride * x, 1. - h_stride * y)).ba, texture2D(Sampler, vec2(0., 1. - h_stride * (y + 1.))).r);
			//}
			
        }
        else
        {
            return vec3(texture2D(Sampler, vec2(w_stride * x, 1. - h_stride * y)).ba, texture2D(Sampler, vec2(w_stride * (x + 1.), 1. - h_stride * y)).r);
        }
    }
    else if(int(shift)==3)
    {
        if(x==width - 1.)
        {
            return vec3(texture2D(Sampler,vec2(w_stride*x,1. - h_stride*y)).a,texture2D(Sampler,vec2(0.,1. - h_stride*(y+1.))).rg);
        }
        else
        {
            return vec3(texture2D(Sampler,vec2(w_stride*x,1. - h_stride*y)).a,texture2D(Sampler,vec2(w_stride*(x+1.),1. - h_stride*y)).rg);
        }
    }

#endif
#ifdef __tex_component_3__

    if(int(shift)==0)
    {
        return texture2D(Sampler,vec2(w_stride*x,h_stride*y)).rgb;
    }
    else if(int(shift)==1)
    {
        if(x==width - 1.)
        {
            return vec3(texture2D(Sampler,vec2(w_stride*x,1. - h_stride*y)).gb,texture2D(Sampler,vec2(0.,1. -  h_stride*(y+1.))).r);
        }
        else
        {
            return vec3(texture2D(Sampler,vec2(w_stride*x,1. - h_stride*y)).gb,texture2D(Sampler,vec2(w_stride*(x+1.),1. - h_stride*y)).r);
        }
    }
    else if(int(shift)==3)
    {
        if(x==width - 1.)// или (x==width-1)
        {
            return vec3(texture2D(Sampler,vec2(w_stride*x,1. - h_stride*y)).b,texture2D(Sampler,vec2(0.,1. - h_stride*(y+1.))).rg);
        }
        else
        {
            return vec3(texture2D(Sampler,vec2(w_stride*x,1. - h_stride*y)).b,texture2D(Sampler,vec2(w_stride*(x+1.),1. - h_stride*y)).rg);
        }
    }

#endif
	return vec3(0., 0., 0.);
}