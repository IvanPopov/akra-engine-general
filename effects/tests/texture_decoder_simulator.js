var fs = require('fs');
eval(fs.readFileSync('glsl_simulator.js', 'utf-8'));


function A_tex2D(S, H, X, Y) {
    return texture2D(S, vec2(H.stepX * X, H.stepY * Y));
}

function A_TextureHeader () {
    this.width  = 0;
    this.height = 0;
    this.stepX  = 0;
    this.stepY  = 0;

    if (arguments) {
        A_TextureHeader.prototype.set.apply(this, arguments)
    }   
};

A_TextureHeader.prototype.set = function (w, h, sx, sy) {
    this.width = w;
    this.height = h;
    this.stepX = sx;
    this.stepY = sy;    
}
 
function A_extractTextureHeader(src, texture) {
    var v = texture2D(src, vec2(0.));
    texture.set(v.r, v.g, v.b, v.a);
}
 
function A_extractVec3(sampler, header, offset) 
{        

    var pixelNumber = Math.floor(offset / A_VB_ELEMENT_SIZE);         
    var y = Math.floor(pixelNumber / header.width);  
    var x = pixelNumber % header.width;
    //console.log('x,y', [x, y]);
    var shift = int32(offset % A_VB_ELEMENT_SIZE);
    
    if(shift == 0)                  return A_tex2D(sampler, header, x, y).rgb;
    else if(shift == 1)             return A_tex2D(sampler, header, x, y).gba; 
    else if(shift == 2)
    {
        if(int32(x) == int32(header.width - 1.))  return vec3(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, 0., (y + 1.)).r); 
        else                        return vec3(A_tex2D(sampler, header, x, y).ba, A_tex2D(sampler, header, (x + 1.), y).r);
    }
    else if(shift == 3)
    {
        if(int32(x) == int32(header.width - 1.))  return vec3(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, 0., (y + 1.)).rg); 
        else                        return vec3(A_tex2D(sampler, header, x, y).a, A_tex2D(sampler, header, (x + 1.), y).rg); 
    }
    return vec3(0);
}
 
 
 
var INDEX1 = [0, 2, 3, 0, 3, 1, 0, 1, 5, 0, 5, 4, 6, 7, 3, 6, 3, 2, 0, 4, 6, 0, 6, 2, 3, 7, 5, 3, 5, 1, 5, 7, 6, 5, 6, 4];
var INDEX2 = [4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5];
 
 
var POSITION_offset = 104.;
var NORMAL_offset = 32.;
 

var A_buffer_0 = new sampler2D([4,4,0.25,0.25,16,64,0,0,1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1,-0.5,0.5,0.5,0.5,0.5,0.5,-0.5,-0.5,0.5,0.5,-0.5,0.5,-0.5,0.5,-0.5,0.5,0.5,-0.5,-0.5,-0.5,-0.5,0.5,-0.5,-0.5,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 4, 4);
var dataTextureHeader = new A_TextureHeader();


 
 
function main () {
    A_extractTextureHeader(A_buffer_0, dataTextureHeader);
    for (var i = 0; i < INDEX1.length; ++ i) {
        var vertex = A_extractVec3(A_buffer_0, dataTextureHeader, (POSITION_offset + INDEX1[i] * 12.) / 4.0);
        var normal = A_extractVec3(A_buffer_0, dataTextureHeader, (NORMAL_offset + INDEX2[i] * 12.) / 4.0);    

        console.log([INDEX1[i], INDEX2[i]], 'offset', (POSITION_offset + INDEX1[i] * 12.) / 4.0, 'vertex', vertex, 'offset', (NORMAL_offset + INDEX2[i] * 12.) / 4.0, 'normal', normal)
    }
    
}

main();