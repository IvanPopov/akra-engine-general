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
    if(fDistanceMultiplier != 0.){
        if(w < 1./(fDistanceMultiplier)){
            relativePositionOffset = vec4(realPositionOffset,0.);
        }
        else{
            relativePositionOffset = vec4(realPositionOffset,0.)/w/(fDistanceMultiplier);
        }
    }
    else{
        relativePositionOffset = vec4(realPositionOffset,0.);
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
        if(color.w == 0.){
            discard;
        }
    }
    else{
        float lineDataOffset = currentLineData.y;//оффсет указывающий где начинаются данные для текущей строки

        vec4 letterData = A_extractVec4(A_buffer_0, vb_header,startIndex + (lineDataOffset + nCurrentLinePosition)*4.);
        vec2 realTextureCoords = letterData.xy + vec2(fract(fCurrentLinePosition),fract(fCurrentLine))*letterData.zw;

        //довольно удачная модель прозрачности шрифтов и фона

        float fontGeomenty = (texture2D(textTexture,vec2(realTextureCoords.x,realTextureCoords.y))).w;
        float fEffectiveFontTransparency = fontGeomenty*v4fFontColor.a;

        vec3 v3fEffectiveColor = fEffectiveFontTransparency*v4fFontColor.rgb +
                                    (1. - fEffectiveFontTransparency)*v4fBackgroundColor.a*v4fBackgroundColor.rgb;

        float fEffectiveTransperency = fEffectiveFontTransparency + (1. - fEffectiveFontTransparency)*v4fBackgroundColor.a;
        if(fEffectiveTransperency == 0.){
            discard;
        }

        color = vec4(v3fEffectiveColor/fEffectiveTransperency,fEffectiveTransperency);
    }
    gl_FragColor = color;
}
