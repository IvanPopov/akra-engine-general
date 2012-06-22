/*
 Include('sources/Include.js')
 Include('sources/EffectSyntaxCompatibility.js);
 Include('examples/simple_terrain.fx.js')


 var fx = new a.fx.SimpleTerrain;
 console.log(fx)
 */


function SimpleTerrainEffect () {
    SimpleTerrainEffect.superclass.constructor.apply(this, arguments);

    // transformations
    mat4('mViewProj : VIEWPROJECTION');

    vec4('posOffset : posScaleOffset') = [1.0, 1.0, 0.0, 0.0];
    vec4('texOffset : uvScaleOffset') = [1.0, 1.0, 0.0, 0.0];
    vec4('ambient_light') = [0.5, 0.5, 0.7, 0.0];
    vec4('sun_vec: sunlight_vec') = [0.578, 0.578, 0.578, 0.0];
    //vec4('lightpos: lightpos') = [500, 500, 500, 0.0];
    //vec4('use_bump: use_bump') = [0, 0.0, 0.0, 0.0];

    texture('tex0 : TEXTURE'); //blend
    texture('tex1 : TEXTURE'); // surface 0
    texture('tex2 : TEXTURE'); // surface 1
    texture('tex3 : TEXTURE'); // surface 2
    //texture('tex4 : TEXTURE'); // surface 3

    vertex('VS') = '\
    //--  global                                            \n\
                                                            \n\
    varying vec4 $vDiffuse;                                 \n\
    varying vec2 $vTex0;                                    \n\
    varying vec2 $vTex1;                                    \n\
    varying vec2 $vTex2;                                    \n\
    varying vec2 $vTex3;                                    \n\
    //varying vec3 $vLightVector;                             \n\
                                                            \n\
    //--  declaration                                       \n\
                                                            \n\
    attribute vec2  $Pos;           //-- POSITION0          \n\
    attribute vec2  $UV;            //-- TEXCOORD0          \n\
    attribute float $ZPos;          //-- POSITION1          \n\
    attribute vec3  $Norm;          //-- NORMAL             \n\
                                                            \n\
    uniform mat4  $mViewProj;       //-- mViewProj          \n\
    uniform vec4  $texOffset;       //-- texOffset          \n\
    uniform vec4  $ambient_light;   //-- ambient_light      \n\
    uniform vec4  $sun_vec;         //-- sun_vec            \n\
    uniform vec4  $posOffset;       //-- posOffset          \n\
    uniform vec4  $lightpos;        //-- lightpos           \n\
                                                            \n\
    //--  main                                              \n\
                                                            \n\
    vec4 $combinedPos = vec4(                               \n\
            $Pos.x,                                         \n\
            $Pos.y,                                         \n\
            $ZPos,                                          \n\
            1.0);                                           \n\
                                                            \n\
    $combinedPos.xy += $posOffset.zw;                       \n\
    // position (view space)                                \n\
    vertex = $mViewProj * $combinedPos;                     \n\
                                                            \n\
    $vDiffuse = dot($Norm, $sun_vec.rgb) + $ambient_light;  \n\
    $vTex0 = ($UV + $texOffset.zw) * $texOffset.xy;         \n\
    $vTex1 = $UV;                                           \n\
    $vTex2 = $UV;                                           \n\
    $vTex3 = $UV;                                           \n\
                                                            \n\
                                                            \n\
    //vec3 $normal = $Norm;                                   \n\
    //vec3 $binormal = cross(vec3(1,0,0), $normal);           \n\
    //vec3 $tang = cross($normal, $binormal);                 \n\
    //                                                        \n\
    //mat3 $t;                                                \n\
    //$t[0] = $tang;                                          \n\
    //$t[1] = $binormal;                                      \n\
    //$t[2] = -$normal;                                        \n\
    //                                                        \n\
    //                                                        \n\
    //vec3 $light = $t * normalize($lightpos.xyz -            \n\
    //    $combinedPos.xyz);                                  \n\
    //$vLightVector = 0.5 * $light + 0.5;                     \n\
    ';

    sampler('LinearSamp0') = {
        texture:   'tex0',
        MAGFILTER: 'LINEAR',
        MINFILTER: 'LINEAR',
        AddressU:  'clamp',
        AddressV:  'clamp'
    };

    sampler('LinearSamp1') = {
        texture:   'tex1',
        MAGFILTER: 'LINEAR',
        MINFILTER: 'LINEAR',
        AddressU:  'wrap',
        AddressV:  'wrap'
    };

    sampler('LinearSamp2') = {
        texture:   'tex2',
        MAGFILTER: 'LINEAR',
        MINFILTER: 'LINEAR',
        AddressU:  'wrap',
        AddressV:  'wrap'
    };

    sampler('LinearSamp3') = {
        texture:   'tex3',
        MAGFILTER: 'LINEAR',
        MINFILTER: 'LINEAR',
        AddressU:  'wrap',
        AddressV:  'wrap'
    };

    /*
     sampler('LinearSamp4') = {
     texture:   'tex4',
     MAGFILTER: 'LINEAR',
     MINFILTER: 'LINEAR',
     AddressU:  'wrap',
     AddressV:  'wrap'
     };
     */

    pixel('ThreeSurfaceBlend') = '\
    /*--                                                    \n\
    ;flag DARK_MODE 1.0|disabled 0.5|half 0.25|maximum      \n\
    --*/                                                    \n\
    //--  global                                            \n\
                                                            \n\
    varying vec4 $vDiffuse;                                 \n\
    varying vec2 $vTex0;                                    \n\
    varying vec2 $vTex1;                                    \n\
    varying vec2 $vTex2;                                    \n\
    varying vec2 $vTex3;                                  \n\
    //varying vec3 $vLightVector;                           \n\
                                                            \n\
    //vec3 $expand(vec3 $in) {                              \n\
    //    return ($in * 2.) - vec3(1., 1., 1.);             \n\
    //}                                                     \n\
                                                            \n\
    //--  declaration                                       \n\
                                                            \n\
    uniform sampler2D  $LinearSamp0;    //-- LinearSamp0    \n\
    uniform sampler2D  $LinearSamp1;    //-- LinearSamp1    \n\
    uniform sampler2D  $LinearSamp2;    //-- LinearSamp2    \n\
    uniform sampler2D  $LinearSamp3;    //-- LinearSamp3    \n\
    //uniform sampler2D  $LinearSamp4;    //-- LinearSamp4    \n\
    //uniform vec4       $use_bump;       //-- use_bump     \n\
                                                            \n\
    //--  main                                              \n\
                                                            \n\
    // sample all four textures                             \n\
    vec4 $BlendControler = texture2D($LinearSamp0, $vTex0); \n\
    vec4 $texColor0 = texture2D($LinearSamp1, $vTex1);      \n\
    vec4 $texColor1 = texture2D($LinearSamp2, $vTex2);      \n\
    vec4 $texColor2 = texture2D($LinearSamp3, $vTex3);      \n\
                                                            \n\
    //vec3 $bumpNormal = (texture2D($LinearSamp4,             \n\
    //    $vTex2).rgb);                                       \n\
    //vec3 $lightVector = ($vLightVector);                    \n\
    //float $light = dot($bumpNormal, $lightVector);          \n\
                                                            \n\
    // determine the amount of each surface to blend        \n\
    vec4 $Color0 = ($texColor0 * $BlendControler.r);        \n\
    vec4 $Color1 = ($texColor1 * $BlendControler.g);        \n\
    vec4 $Color2 = ($texColor2 * $BlendControler.b);        \n\
    //if ($use_bump.x != 0.) {                                \n\
    //    $Color1 = $Color1 * $light;                         \n\
    //}                                                       \n\
    // sum the resulting colors                             \n\
    // and multiply by the diffuse                          \n\
    // vertex color                                         \n\
    color = ($Color0 + $Color1 + $Color2) *        \n\
        $BlendControler.a* $vDiffuse;                       \n\
    color.a = 1.0;                                          \n\
    ';


    shader('terrain') = compile('VS', 'ThreeSurfaceBlend');

    technique('SinglePassTerrain') = (function (fx) {
        begin_passes();

        pass('P0') = {
            state: {
                CULLMODE:     'CW',
                ZENABLE:      true,
                ZWRITEENABLE: true,
                ZFUNC:        'LESSEQUAL',

                AlphaBlendEnable: false,
                AlphaTestEnable:  false
            },

            shaders: ['terrain'],
            params:  'set DARK_MODE=1'
        }

        end_passes();
    })(this);

    this.verify();
}

a.extend(SimpleTerrainEffect, a.Effect);

a.fx.LastEffect = SimpleTerrainEffect;

