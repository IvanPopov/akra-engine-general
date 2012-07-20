attribute vec3 POSITION_OFFSET;

uniform vec3 CENTER_POSITION;

uniform mat4 view_mat;
uniform mat4 model_mat;
uniform mat4 proj_mat;

uniform float nLineQuantity; //в буквах
uniform float nLineLength; //в буквах
uniform float nFontSize;

uniform vec2 v2fCanvasSizes; //необходимы для ограничения максимального размера шрифта указанным ..размер в пикселях
uniform float fDistanceMultiplier;//параметр влияющтй на уменьшение текста с расстоянием 1 - уменьшение со скоростью сцены, 0 - фиксированный размер;

varying float fCurrentLine;
varying float fCurrentLinePosition;

void main(void) {

    fCurrentLinePosition = (POSITION_OFFSET.x + 1.)/2.*nLineLength;
    fCurrentLine = (1. - (POSITION_OFFSET.y + 1.)/2.)*nLineQuantity;

    vec3 realPositionOffset = vec3(POSITION_OFFSET.x*nLineLength,POSITION_OFFSET.y*nLineQuantity,0.);
    realPositionOffset.xy *= nFontSize/v2fCanvasSizes;

    vec4 position = proj_mat*view_mat * model_mat * vec4(CENTER_POSITION, 1.);
    float w = position.w;
    vec4 screenRelativePosition = position/w;//center position in gl relative coordinates
    //if(position.w < 1.){
    //
    //}
    vec4 relativePositionOffset;
    if(fDistanceMultiplier == 0. || w < 1./(fDistanceMultiplier)){
        relativePositionOffset = vec4(realPositionOffset,0.);
    }
    else{
        relativePositionOffset = vec4(realPositionOffset,0.)/w/(fDistanceMultiplier);
    }
    //relativePositionOffset = vec4(realPositionOffset,0.);
    gl_Position = screenRelativePosition + relativePositionOffset;
    
}

//<-- split -- >

#ifdef GL_ES                    
    precision highp float;      
#endif                          

#include "decode_texture.glsl"

uniform sampler2D textTexture;
uniform sampler2D A_buffer_0;
uniform float startIndex;

uniform vec4 v4fBackgroundColor;
uniform vec4 v4fFontColor;

uniform vec2 textTextureSteps;

varying float fCurrentLine;
varying float fCurrentLinePosition;

void main(void) {
    vec4 color;

    float nCurrentLine = floor(fCurrentLine);
    float nCurrentLinePosition = floor(fCurrentLinePosition);

    A_TextureHeader vb_header;
    A_extractTextureHeader(A_buffer_0, vb_header);

    vec4 currentLineData = A_extractVec4(A_buffer_0, vb_header,startIndex + nCurrentLine*4.);

    if(currentLineData.x < nCurrentLinePosition){
        color = v4fBackgroundColor;
    }
    else{
        float lineDataOffset = currentLineData.y;//оффсет указывающий где начинаются данные для текущей строки

        vec2 startTextureCoords = A_extractVec2(A_buffer_0, vb_header,startIndex + (lineDataOffset + nCurrentLinePosition)*4.);

        vec2 realTextureCoords = startTextureCoords + vec2(fract(fCurrentLinePosition),fract(fCurrentLine))*textTextureSteps;

        vec4 textureColor = texture2D(textTexture,vec2(realTextureCoords.x,realTextureCoords.y));

        if(textureColor == vec4(0.)){
            color = v4fBackgroundColor;
        }
        else{
            color = v4fFontColor;//textureColor;//vec4(v4fFontColor.rgb,textureColor.w);
        }
    }
    if(color.w == 0.){
        discard;
    }
    gl_FragColor = color;
}
