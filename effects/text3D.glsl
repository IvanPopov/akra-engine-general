#include "decode_texture.glsl"

attribute vec3 POSITION_OFFSET;

uniform vec3 CENTER_POSITION;

uniform mat4 view_mat;
uniform mat4 model_mat;
uniform mat4 proj_mat;

uniform float nLineQuantity;
uniform float nLineLength;
uniform float nFontSize;

varying float fCurrentLine;
varying float fCurrentLinePosition;

void main(void) {

    fCurrentLinePosition = (POSITION_OFFSET.x + 0.5)*nLineLength;
    fCurrentLine = (1. - (POSITION_OFFSET.y + 0.5))*nLineQuantity;

    vec3 realPositionOffset = vec3(POSITION_OFFSET.x*nLineLength,POSITION_OFFSET.y*nLineQuantity,0.);

    vec4 pos = view_mat * model_mat * vec4(CENTER_POSITION, 1.) + vec4(realPositionOffset,0.)*5.; //+ vec4(position*2.*opacity,0.);
    //vert = pos.xyz;

    gl_Position = proj_mat * pos;
}

//<-- split -- >

#ifdef GL_ES                    
    precision highp float;      
#endif                          

#include "decode_texture.glsl"

uniform sampler2D textTexture;
uniform sampler2D A_buffer_0;
uniform float startIndex;

uniform float nLineQuantity;
uniform float nLineLength;

uniform vec2 textTextureSteps;

varying float fCurrentLine;
varying float fCurrentLinePosition;

void main(void) {
    float nCurrentLine = floor(fCurrentLine);
    float nCurrentLinePosition = floor(fCurrentLinePosition);

    A_TextureHeader vb_header;
    A_extractTextureHeader(A_buffer_0, vb_header);

    vec4 currentLineData = A_extractVec4(A_buffer_0, vb_header,startIndex + nCurrentLine*4.);

    if(currentLineData.x < nCurrentLinePosition){
        gl_FragColor = vec4(0.,0.,1.,1.);
        return;
    }

    float lineDataOffset = currentLineData.y;//оффсет указывающий где начинаются данные для текущей строки

    vec2 startTextureCoords = A_extractVec2(A_buffer_0, vb_header,startIndex + (lineDataOffset + nCurrentLinePosition)*4.);

    vec2 realTextureCoords = startTextureCoords + vec2(fract(fCurrentLinePosition),fract(fCurrentLine))*textTextureSteps;

    vec4 textureColor = texture2D(textTexture,vec2(realTextureCoords.x,realTextureCoords.y));

    //if(textureColor == vec4(0.)){
    //   discard;
    //}
    gl_FragColor = vec4(textureColor.rgb,1.);
}
