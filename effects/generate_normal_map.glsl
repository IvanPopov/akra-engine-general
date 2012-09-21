attribute vec2 POSITION;
varying vec2 texturePosition;

void main(void){
    texturePosition = (POSITION + vec2(1.))/2.;
    gl_Position = vec4(POSITION,0.,1.);
}

//<-- split -- >

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 fSteps; //iverse texture size
uniform float fScale; //height boost
uniform sampler2D heightTexture;
uniform int iChannel; //�����, �� �������� ���������� ����� ������

varying vec2 texturePosition;

void main(void){

    //generate normals

    float fHeight0,fHeight1,fHeight2,fHeight3,
        fHeight4,fHeight5,fHeight6,fHeight7,fHeight8;

    if(iChannel == 0){
        fHeight0 = (texture2D(heightTexture,texturePosition)).r;
        fHeight1 = (texture2D(heightTexture,texturePosition + vec2(fSteps.x,0.))).r;
        fHeight2 = (texture2D(heightTexture,texturePosition + vec2(fSteps.x,fSteps.y))).r;
        fHeight3 = (texture2D(heightTexture,texturePosition + vec2(0.,fSteps.y))).r;
        fHeight4 = (texture2D(heightTexture,texturePosition + vec2(-fSteps.x,fSteps.y))).r;
        fHeight5 = (texture2D(heightTexture,texturePosition + vec2(-fSteps.x,0.))).r;
        fHeight6 = (texture2D(heightTexture,texturePosition + vec2(-fSteps.x,-fSteps.y))).r;
        fHeight7 = (texture2D(heightTexture,texturePosition + vec2(0.,-fSteps.y))).r;
        fHeight8 = (texture2D(heightTexture,texturePosition + vec2(fSteps.x,-fSteps.y))).r;
    }
    else if(iChannel == 1){
        fHeight0 = (texture2D(heightTexture,texturePosition)).g;
        fHeight1 = (texture2D(heightTexture,texturePosition + vec2(fSteps.x,0.))).g;
        fHeight2 = (texture2D(heightTexture,texturePosition + vec2(fSteps.x,fSteps.y))).g;
        fHeight3 = (texture2D(heightTexture,texturePosition + vec2(0.,fSteps.y))).g;
        fHeight4 = (texture2D(heightTexture,texturePosition + vec2(-fSteps.x,fSteps.y))).g;
        fHeight5 = (texture2D(heightTexture,texturePosition + vec2(-fSteps.x,0.))).g;
        fHeight6 = (texture2D(heightTexture,texturePosition + vec2(-fSteps.x,-fSteps.y))).g;
        fHeight7 = (texture2D(heightTexture,texturePosition + vec2(0.,-fSteps.y))).g;
        fHeight8 = (texture2D(heightTexture,texturePosition + vec2(fSteps.x,-fSteps.y))).g;
    }
    else if(iChannel == 2){
        fHeight0 = (texture2D(heightTexture,texturePosition)).b;
        fHeight1 = (texture2D(heightTexture,texturePosition + vec2(fSteps.x,0.))).b;
        fHeight2 = (texture2D(heightTexture,texturePosition + vec2(fSteps.x,fSteps.y))).b;
        fHeight3 = (texture2D(heightTexture,texturePosition + vec2(0.,fSteps.y))).b;
        fHeight4 = (texture2D(heightTexture,texturePosition + vec2(-fSteps.x,fSteps.y))).b;
        fHeight5 = (texture2D(heightTexture,texturePosition + vec2(-fSteps.x,0.))).b;
        fHeight6 = (texture2D(heightTexture,texturePosition + vec2(-fSteps.x,-fSteps.y))).b;
        fHeight7 = (texture2D(heightTexture,texturePosition + vec2(0.,-fSteps.y))).b;
        fHeight8 = (texture2D(heightTexture,texturePosition + vec2(fSteps.x,-fSteps.y))).b;
    }
    else{
        fHeight0 = (texture2D(heightTexture,texturePosition)).a;
        fHeight1 = (texture2D(heightTexture,texturePosition + vec2(fSteps.x,0.))).a;
        fHeight2 = (texture2D(heightTexture,texturePosition + vec2(fSteps.x,fSteps.y))).a;
        fHeight3 = (texture2D(heightTexture,texturePosition + vec2(0.,fSteps.y))).a;
        fHeight4 = (texture2D(heightTexture,texturePosition + vec2(-fSteps.x,fSteps.y))).a;
        fHeight5 = (texture2D(heightTexture,texturePosition + vec2(-fSteps.x,0.))).a;
        fHeight6 = (texture2D(heightTexture,texturePosition + vec2(-fSteps.x,-fSteps.y))).a;
        fHeight7 = (texture2D(heightTexture,texturePosition + vec2(0.,-fSteps.y))).a;
        fHeight8 = (texture2D(heightTexture,texturePosition + vec2(fSteps.x,-fSteps.y))).a;
    }


    //��������� ��� ����� ���������
    fHeight0 = fHeight0*2. - 1.;
    fHeight1 = fHeight1*2. - 1.;
    fHeight2 = fHeight2*2. - 1.;
    fHeight3 = fHeight3*2. - 1.;
    fHeight4 = fHeight4*2. - 1.;
    fHeight5 = fHeight5*2. - 1.;
    fHeight6 = fHeight6*2. - 1.;
    fHeight7 = fHeight7*2. - 1.;
    fHeight8 = fHeight8*2. - 1.;

    vec3 dir1 = vec3(fSteps.x, 0., (fHeight1 - fHeight0)*fScale);
    vec3 dir2 = vec3(fSteps.x, fSteps.y, (fHeight2 - fHeight0)*fScale);
    vec3 dir3 = vec3(0., fSteps.y, (fHeight3 - fHeight0)*fScale);
    vec3 dir4 = vec3(-fSteps.x, fSteps.y, (fHeight4 - fHeight0)*fScale);
    vec3 dir5 = vec3(-fSteps.x, 0., (fHeight5 - fHeight0)*fScale);
    vec3 dir6 = vec3(-fSteps.x, -fSteps.y, (fHeight6 - fHeight0)*fScale);
    vec3 dir7 = vec3(0., -fSteps.y, (fHeight7 - fHeight0)*fScale);
    vec3 dir8 = vec3(fSteps.x, -fSteps.y, (fHeight8 - fHeight0)*fScale);

    vec3 normal1 = normalize(cross(dir1,dir2));
    vec3 normal2 = normalize(cross(dir2,dir3));
    vec3 normal3 = normalize(cross(dir3,dir4));
    vec3 normal4 = normalize(cross(dir4,dir5));
    vec3 normal5 = normalize(cross(dir5,dir6));
    vec3 normal6 = normalize(cross(dir6,dir7));
    vec3 normal7 = normalize(cross(dir7,dir8));
    vec3 normal8 = normalize(cross(dir8,dir1));

    vec3 normal = normalize(normal1 + normal2 + normal3 + normal4
            + normal5 + normal6 + normal7 + normal8);
    if(fHeight0<0.6)
    {
        gl_FragColor = vec4(0.,0.,1.,1.);
        //gl_FragColor = vec4(normal/2. + vec3(0.5),1.);
    }
    else
    {
        gl_FragColor = vec4(0.,0.,0.,1.);
    }
}