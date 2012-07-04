uniform sampler2D sourceTexture;                                                
attribute vec4  VALUE;                                                          
attribute float INDEX;                                                          
attribute float SHIFT;                                                          
                                                                                
uniform vec2 size;                                                              
                                                                                
varying vec4 color;                                                            
                                                                                
void main(void){                                                                
    vec4 value = VALUE;                                                         
    float  serial = INDEX;                                               
                                                                                
    int shift = int(SHIFT);                                                     
    if (shift != 0) {                                                        
        color = texture2D(sourceTexture,                                        
            vec2((mod(serial, size.x) +.5 ) / size.x, (floor(serial / size.x) + .5) / size.y)
            );

        if (shift > 0 && INDEX == 1966.) {
            //if (shift == 2)
            //return;
        }   

        if (shift == 1) {               
            color = vec4(color.r, value.gba);      
        }                               
        else if (shift == 2) {  /*
            if (INDEX == 1966. && color.b == 0.) {//vec4(0,0,0,1)

                if (texture2D(sourceTexture,                                        
                    vec2((mod(serial-20., size.x) +.5 ) / size.x, (floor((serial-20.) / size.x) + .5) / size.y)
                    ) == vec4(0.,0.,0.,1.))
                return;
            }      */ 
            color = vec4(color.rg, value.ba);       ///???? 
        }                               
        else if (shift == 3) {          
            color = vec4(color.rgb, value.a);          
        }                               
        else if (shift == -1) {         
            color = vec4(value.r, color.gba);      
        }                               
        else if (shift == -2) {         
            color = vec4(value.rg, color.ba);        
        }                               
        else {                          
            color = vec4(value.rgb, color.a);          
        } 


    }
    else {                                                                                              
        color = value;                                                              
    }

    gl_Position = vec4(2. * (mod(serial, size.x) + .5) / size.x - 1.,                  
                    2. * (floor(serial / size.x)  + .5) / size.y - 1., 0., 1.);        
}                                                                               

//<-- split -- >

#ifdef GL_ES                        
    precision highp float;          
#endif                              
                                    
varying vec4 color;                 
                                    
void main(void) {                    
    gl_FragColor = color;           
}                                   
            
