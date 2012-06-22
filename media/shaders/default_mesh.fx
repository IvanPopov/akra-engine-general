/*
function DefaultMeshEffect() {
DefaultMeshEffect.superclass.constructor.apply(this, arguments);
//this.vec4("k_d : MATERIALDIFFUSE").val = [1, 1, 1, 1];
//this.texture("tex0 : TEXTURE");
this.mat4("mWorldViewProj : WORLDVIEWPROJECTION").val;
//this.sampler("LinearSamp0").val =  {texture: "tex0", MAGFILTER: "LINEAR", MINFILTER: "LINEAR", AddressU: "clamp", AddressV: "clamp"};
this.vertex("VS").val = '\n\
//--  global                                            \n\
//--  declaration                                       \n\
attribute vec3 $Pos;           //-- POSITION            \n\
attribute vec3 $Norm;           //-- NORMAL             \n\
uniform mat4 $mWorldViewProj; //-- mWorldViewProj       \n\
//--  main                                              \n\
vertex = $mWorldViewProj * vec4($Pos, 1.);              \n\
vec3 $n = $Norm;\n\
';
this.pixel("PS").val = "\n            //--  global                                            \n                                                 \n            //--  declaration                                       \n            \n            //--  main                                              \n            color = vec4(1., 0., 0., 1.);                \n    ";
this.shader("defaultMesh").val = Object( {vertex: "VS", pixel: "PS"});
this.technique("TVertexAndPixelShader").val = (function(fx) {
var passes=[];
(passes[passes.length] = new a.EffectPass("P0", fx)).val =  {state:  {CULLMODE: "CW", ZENABLE: true, ZWRITEENABLE: true, ZFUNC: "LESSEQUAL"}, shaders: ["defaultMesh"]};
return passes;

}
)(this);
this.verify();

}

a.extend(DefaultMeshEffect, a.Effect);
a.fx.LastEffect = DefaultMeshEffect;          */


;
function DefaultMeshEffect() {
DefaultMeshEffect.superclass.constructor.apply(this, arguments);
this.texture("tex0 : TEXTURE");
this.mat4("mWorldViewProj : WORLDVIEWPROJECTION").val;
this.sampler("LinearSamp0").val =  {texture: "tex0", MAGFILTER: "LINEAR", MINFILTER: "LINEAR", AddressU: "clamp", AddressV: "clamp"};
this.vertex("VS").val = "\n        //--  global                                            \n        varying vec2 $vTex;                                     \n        //--  declaration                                       \n        attribute vec3 $Pos;           //-- POSITION            \n        attribute vec3 $Norm;          //-- NORMAL              \n        attribute vec2 $Tex;           //-- TEXCOORD            \n                                                                \n        uniform mat4 $mWorldViewProj; //-- mWorldViewProj       \n        //--  main                                              \n        vertex = $mWorldViewProj * vec4($Pos, 1.);              \n        $vTex = $Tex; vec3 $n = $Norm;                                          \n    ";
this.pixel("PS").val = "\n            //--  global                                            \n            varying vec2 $vTex;                                     \n            //--  declaration                                       \n            uniform sampler2D  $LinearSamp0;    //-- LinearSamp0    \n            //--  main                                              \n            color = texture2D($LinearSamp0, $vTex);                 \n    ";
this.shader("defaultMesh").val = Object( {vertex: "VS", pixel: "PS"});
this.technique("TVertexAndPixelShader").val = (function(fx) {
var passes=[];
(passes[passes.length] = new a.EffectPass("P0", fx)).val =  {state:  {CULLMODE: "CW", ZENABLE: true, ZWRITEENABLE: true, ZFUNC: "LESSEQUAL"}, shaders: ["defaultMesh"]};
return passes;

}
)(this);
this.verify();

}

a.extend(DefaultMeshEffect, a.Effect);
a.fx.LastEffect = DefaultMeshEffect;
