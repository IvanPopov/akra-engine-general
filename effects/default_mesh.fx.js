Include('/sources/shaders/effect/EffectSyntaxCompatibility.js');


function DefaultMeshEffect () {
    DefaultMeshEffect.superclass.constructor.apply(this, arguments);

    //material
    vec4        ('mat_diffuse : MATERIALDIFFUSE') = [1.0, 1.0, 1.0, 1.0];     // diffuse
    vec4        ('mat_ambient : MATERIALAMBIENT');
    vec4        ('mat_specular: MATERIALSPECULAR');
    vec4        ('mat_emissive: MATERIALEMISSIVE');
    float32     ('mat_power   : MATERIALPOWER');

    //texture
    texture     ('tex0 : TEXTURE');

    //transform
    mat4        ('mWorldViewProj  : WORLDVIEWPROJECTION');
    mat4        ('mViewProjection : VIEWPROJECTION');
    mat4        ('mModel          : WORLD');
    mat3        ('mNormal         : NORMALMATRIX');
    vec3        ('cViewPosition   : WORLDCAMERAPOS');

    //light
    vec4 ('light_position')     = [3.0, 15.0, 15.0, 1.0];
    vec4 ('light_ambient')      = [0.1, 0.1, 0.1, 1.0];
    vec4 ('light_diffuse')      = [1.0, 1.0, 1.0, 1.0];
    vec4 ('light_specular')     = [1.0, 1.0, 1.0, 1.0];
    vec3 ('light_attenuation')  = [0.0, 0.0, 0.002];

    sampler     ('LinearSamp0') = {
        texture:   'tex0',
        MAGFILTER: 'LINEAR',
        MINFILTER: 'LINEAR',
        //MIPFILTER: 'LINEAR',
        AddressU:  'clamp',
        AddressV:  'clamp'
        //AddressW:  'clamp'
    };

    vertex      ('VS') = '\n\
        //--  global                                            \n\
        varying vec2 $vTex;                                     \n\
        varying vec3  $vNormal;                                 \n\
        varying vec3  $vLightDir;                               \n\
        varying vec3  $vViewDir;                                \n\
        varying float $vDistance;                               \n\
                                                                \n\
        //--  declaration                                       \n\
        attribute vec3 $Pos;           //-- POSITION            \n\
        attribute vec3 $Norm;          //-- NORMAL              \n\
        attribute vec2 $Tex;           //-- TEXCOORD            \n\
                                                                \n\
        uniform mat4 $mViewProjection; //-- mViewProjection     \n\
        uniform mat4 $mModel;          //-- mModel              \n\
        uniform mat3 $mNormal;         //-- mNormal             \n\
        uniform vec3 $cViewPosition;   //-- cViewPosition       \n\
                                                                \n\
        uniform vec4 $light_position;   //-- light_position     \n\
        uniform vec4 $light_ambient;    //-- light_ambient      \n\
        uniform vec4 $light_diffuse;    //-- light_diffuse      \n\
        uniform vec4 $light_specular;   //-- light_specular     \n\
        uniform vec3 $light_attenuation;//-- light_attenuation  \n\
                                                                \n\
                                                                \n\
        //--  main                                              \n\
        vertex = $mModel * vec4($Pos, 1.);                      \n\
                                                                \n\
        vec4 $lightDir = $light_position - vertex;              \n\
                                                                \n\
        $vNormal   = $mNormal * $Norm;                          \n\
        $vLightDir = vec3($lightDir);                           \n\
        $vViewDir  = $cViewPosition - vec3(vertex);             \n\
        $vDistance = length($lightDir);                         \n\
                                                                \n\
        $vTex = $Tex;                                           \n\
        vertex = $mViewProjection * vertex;                     \n\
    ';

    pixel       ('PS') = '\n\
            //--  global                                            \n\
            varying vec2 $vTex;                                     \n\
            varying vec3  $vNormal;                                 \n\
            varying vec3  $vLightDir;                               \n\
            varying vec3  $vViewDir;                                \n\
            varying float $vDistance;                               \n\
            //--  declaration                                       \n\
                                                                    \n\
            uniform vec4 $light_position;   //-- light_position     \n\
            uniform vec4 $light_ambient;    //-- light_ambient      \n\
            uniform vec4 $light_diffuse;    //-- light_diffuse      \n\
            uniform vec4 $light_specular;   //-- light_specular     \n\
            uniform vec3 $light_attenuation;//-- light_attenuation  \n\
                                                                    \n\
            uniform sampler2D  $LinearSamp0;    //-- LinearSamp0    \n\
                                                                    \n\
            uniform vec4 $mat_diffuse;      //-- mat_diffuse        \n\
            uniform vec4 $mat_ambient;      //-- mat_ambient        \n\
            uniform vec4 $mat_specular;     //-- mat_specular       \n\
            uniform vec4 $mat_emissive;     //-- mat_emissive       \n\
            uniform float $mat_power;       //-- mat_power          \n\
            //--  main                                              \n\
            \
            vec3 $normal   = normalize($vNormal);                       \n\
            vec3 $lightDir = normalize($vLightDir);                     \n\
            vec3 $viewDir  = normalize($vViewDir);                      \n\
        \
            float $attenuation = 1.0 / ($light_attenuation[0] +         \n\
                $light_attenuation[1] * $vDistance +                    \n\
                $light_attenuation[2] * $vDistance * $vDistance);       \n\
        \
            color = $mat_emissive;                                      \n\
            color += $mat_ambient * $light_ambient * $attenuation;      \n\
        \
            float $NdotL = max(dot($normal, $lightDir), 0.0);           \n\
            color += $mat_diffuse * $light_diffuse * $NdotL * $attenuation;\n\
                                                                        \n\
            float $RdotVpow = max(pow(dot(reflect(-$lightDir, $normal), $viewDir), $mat_power), 0.0);\n\
            color += $mat_specular * $light_specular * $RdotVpow * $attenuation;\n\
                                                                        \n\
            vec4 $texV = texture2D($LinearSamp0, $vTex);            \n\
            if ($texV.a != 1. || $texV.r != 0. || $texV.g != 0. || $texV.b != 0.)     \n\
                    color *= $texV;                                 \n\
    ';


    shader('defaultMesh') = compile('VS', 'PS');

    technique('TVertexAndPixelShader') = (function (fx) {
        begin_passes();

        pass('P0') = {
            state: {
                CULLMODE:     'CW',
                ZENABLE:      true,
                ZWRITEENABLE: true,
                ZFUNC:        'LESSEQUAL'
            },

            shaders: ['defaultMesh']
        }

        end_passes();
    })(this);

    this.verify();
}

a.extend(DefaultMeshEffect, a.Effect);

a.fx.LastEffect = DefaultMeshEffect;

