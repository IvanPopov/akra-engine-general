attribute vec3 POSITION_OFFSET;

uniform vec3 CENTER_POSITION;

uniform mat4 view_mat;
uniform mat4 model_mat;
uniform mat4 proj_mat;

uniform float nLineQuantity; //в буквах
uniform float nLineLength; //в буквах
uniform float nFontSize;

uniform vec2 nPixelsSizes;//необходимые размеры спрайта в пикселях

uniform vec2 v2fCanvasSizes; //необходимы для ограничения максимального размера шрифта указанным ..размер в пикселях
uniform float fDistanceMultiplier;//параметр влияющтй на уменьшение текста с расстоянием 1 - уменьшение со скоростью сцены, 0 - фиксированный размер;

varying vec3 fCurrentParameters;
//.x - current line
//.y - current line position


void main(void) {

    fCurrentParameters.x = (1. - (POSITION_OFFSET.y + 1.)/2.)*nLineQuantity;
    fCurrentParameters.y = (POSITION_OFFSET.x + 1.)/2.*nLineLength;
    fCurrentParameters.z = (POSITION_OFFSET.x + 1.)/2.*nPixelsSizes.x;

    //vec3 realPositionOffset = vec3(POSITION_OFFSET.x*nLineLength,POSITION_OFFSET.y*nLineQuantity,0.);
    //realPositionOffset.xy *= nFontSize/v2fCanvasSizes;
    vec3 realPositionOffset = POSITION_OFFSET;
    realPositionOffset.xy *= nPixelsSizes/v2fCanvasSizes;

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

varying vec3 fCurrentParameters;
//.x - current line
//.y - current line position
//.z - current line pixel position


void main(void) {
    vec4 color;

    float nCurrentLine = floor(fCurrentParameters.x);
    float nCurrentLinePosition = floor(fCurrentParameters.y);
    float nCurrentPixelPosition = floor(fCurrentParameters.z);

    float fAveragePixelsPerLetter = fCurrentParameters.z/fCurrentParameters.y;
    float fCurrentPositionInLetter = mod(fCurrentParameters.z,fAveragePixelsPerLetter);

    A_TextureHeader vb_header;
    A_extractTextureHeader(A_buffer_0, vb_header);

    vec4 currentLineData = A_extractVec4(A_buffer_0, vb_header,startIndex + nCurrentLine*4.);

    float lineDataOffset = currentLineData.x;//оффсет указывающий на описание текущей строки
    float letterDataOffset = currentLineData.y;//оффсет указывающий на описание укв в текущей строке
    //gl_FragColor = vec4(1.,0.,0.,1.);
    //return;
    vec4 positionData = A_extractVec4(A_buffer_0, vb_header,startIndex 
        + (lineDataOffset + nCurrentLinePosition)*4.);

    float firstLetterLength = positionData.w - positionData.z;
    float currentXPosition;
    float currentYPosition = fract(fCurrentParameters.x);

    float currentLetter = positionData.x;

    if(fCurrentParameters.z > currentLineData.z){
        if(v4fBackgroundColor.w == 0.){
            discard;
        }
        gl_FragColor = v4fBackgroundColor;
        return;
    }

    if(fCurrentPositionInLetter < firstLetterLength){
        currentXPosition = (positionData.z + fCurrentPositionInLetter)/positionData.y;
    }
    else{
        float totalLength = firstLetterLength;
        float typographicalWidth;
        //нам нужна следующая буква
        for(int i=0;i<3;i++){
            currentLetter++;

            //данные о геометрии буквы
            vec4 letterGeometry = A_extractVec4(A_buffer_0, vb_header,startIndex 
                + (letterDataOffset + currentLetter*2. + 1.)*4.);

            typographicalWidth = letterGeometry.x;

            if(fCurrentPositionInLetter < totalLength + typographicalWidth){
                break;
            }
            totalLength += typographicalWidth;
        }
        currentXPosition = (fCurrentPositionInLetter - totalLength)/typographicalWidth;
    }

    vec4 letterData = A_extractVec4(A_buffer_0, vb_header,startIndex 
            + (letterDataOffset + currentLetter*2.)*4.);

    vec2 realTextureCoords = letterData.xy + 
            vec2(currentXPosition,currentYPosition)*letterData.zw;

    //довольно удачная модель прозрачности шрифтов и фона

    float fontGeomenty = (texture2D(textTexture,vec2(realTextureCoords.x,realTextureCoords.y))).w;
    float fEffectiveFontTransparency = fontGeomenty*v4fFontColor.a;

    vec3 v3fEffectiveColor = fEffectiveFontTransparency*v4fFontColor.rgb +
                                (1. - fEffectiveFontTransparency)*v4fBackgroundColor.a
                                        *v4fBackgroundColor.rgb;

    float fEffectiveTransperency = fEffectiveFontTransparency 
                + (1. - fEffectiveFontTransparency)*v4fBackgroundColor.a;

    if(fEffectiveTransperency == 0.){
        discard;
    }

    color = vec4(v3fEffectiveColor/fEffectiveTransperency,fEffectiveTransperency);
    gl_FragColor = color;
}
