var fs = require('fs');
eval(fs.readFileSync('glsl_simulator.js', 'utf-8'));

                                   
// attribute float SERIALNUMBER;       
// uniform vec2 sourceTextureSize;     
// uniform vec2 destinationTextureSize;
// uniform sampler2D sourceTexture;    



var sourceTextureSize = new vec2(4, 4);     
var destinationTextureSize = new vec2(4, 4);
var sourceTexture = new sampler2D([4,4,0.25,0.25,16,64,0,0,1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1,-0.5,0.5,0.5,0.5,0.5,0.5,-0.5,-0.5,0.5,0.5,-0.5,0.5,-0.5,0.5,-0.5,0.5,0.5,-0.5,-0.5,-0.5,-0.5,0.5,-0.5,-0.5,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 4, 4);                                    ;  

               
                                    
function main(SERIALNUMBER){                    
    console.log('c:', texture2D(sourceTexture, vec2(mod(SERIALNUMBER,sourceTextureSize.x) / sourceTextureSize.x, floor(SERIALNUMBER/sourceTextureSize.x)/sourceTextureSize.y)));
                                    
    console.log('p:', vec4(2. * mod(SERIALNUMBER, destinationTextureSize.x) / destinationTextureSize.x - 1., 2. * floor(SERIALNUMBER/destinationTextureSize.x) / destinationTextureSize.y - 1.,0.,1.));
}                                   

//test
for (var i = 0; i < 16; ++ i) { 
	main(i);
}