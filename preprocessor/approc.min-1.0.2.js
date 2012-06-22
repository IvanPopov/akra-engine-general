/*
 Akra Javascript Preprocessor:
 Copyright (C) 2011-2012 Akra Engine <akra@odserve.org>

 Esprima:
 Copyright (C) 2011 Ariya Hidayat <ariya.hidayat@gmail.com>

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

 PREPROCESSOR VER.: 1.0.2
 */

function l(S){throw S;}var t=void 0,z=!0,I=null,O=!1;
(function(S){function T(a){return 0<="0123456789".indexOf(a)}function da(a){return" "===a||"\t"===a||"\x0B"===a||"\u000c"===a||"\u00a0"===a||"\ufeff"===a}function P(a){return"\n"===a||"\r"===a||"\u2028"===a||"\u2029"===a}function Y(a){return"$"===a||"_"===a||"a"<=a&&"z">=a||"A"<=a&&"Z">=a}function f(){var a="\x00",b=n;b<D&&(a=x[b],n+=1);return a}function M(){var a,b,d;for(d=b=O;n<D;)if(a=x[n],d)f(),P(a)&&(d=O,r+=1);else if(b)f(),"*"===a?(a=x[n],"/"===a&&(f(),b=O)):P(a)&&(r+=1);else if("/"===a)if(a=
x[n+1],"/"===a)f(),f(),d=z;else if("*"===a)f(),f(),b=z;else break;else if(da(a))f();else if(P(a))f(),r+=1;else break}function fa(){var a=x[n],b,d,e;if(";"===a||"{"===a||"}"===a)return f(),{type:o.e,value:a};if(","===a||"("===a||")"===a)return f(),{type:o.e,value:a};b=x[n+1];if("."===a&&!T(b))return{type:o.e,value:f()};d=x[n+2];e=x[n+3];if(">"===a&&">"===b&&">"===d&&"="===e)return f(),f(),f(),f(),{type:o.e,value:">>>="};if("="===a&&"="===b&&"="===d)return f(),f(),f(),{type:o.e,value:"==="};if("!"===
a&&"="===b&&"="===d)return f(),f(),f(),{type:o.e,value:"!=="};if(">"===a&&">"===b&&">"===d)return f(),f(),f(),{type:o.e,value:">>>"};if("<"===a&&"<"===b&&"="===d)return f(),f(),f(),{type:o.e,value:"<<="};if(">"===a&&">"===b&&"="===d)return f(),f(),f(),{type:o.e,value:">>="};if("="===b&&0<="<>=!+-*%&|^/".indexOf(a))return f(),f(),{type:o.e,value:a+b};if(a===b&&0<="+-<>&|".indexOf(a)&&0<="+-<>&|".indexOf(b))return f(),f(),{type:o.e,value:a+b};if(0<="[]<>+-*%&|^!~?:=/".indexOf(a))return{type:o.e,value:f()}}
function Z(){var a="",b,d,e,g;d=O;A=I;M();b=x[n];if("/"===b){for(a=f();n<D;)if(b=f(),a+=b,d)"]"===b&&(d=O);else{"\\"===b&&(a+=f());if("/"===b)break;"["===b&&(d=z);P(b)&&y(E.Oa,r)}d=a.substr(1,a.length-2);for(e="";n<D;){b=x[n];if(!(Y(b)||"0"<=b&&"9">=b))break;e+=b;a+=f()}try{g=RegExp(d,e)}catch(h){y(E.Ga,r)}return{Ta:a,value:g}}}function ga(){var a;if(n>=D)return{type:o.t};a=fa();if("undefined"!==typeof a)return a;a=x[n];if("'"===a||'"'===a){var b;var d="";a=x[n];if(!("'"!==a&&'"'!==a)){for(f();n<
D;)if(b=f(),b===a){a="";break}else"\\"===b?(b=f(),P(b)||(d+="\\",d+=b)):d+=b;""!==a&&y(E.U,r,"ILLEGAL");b={type:o.L,value:d}}return b}if("."===a||T(a)){a:if(b=x[n],T(b)||"."===b){d="";if("."!==b){d=f();b=x[n];if("x"===b||"X"===b){for(d+=f();n<D;){b=x[n];if(!(0<="0123456789abcdefABCDEF".indexOf(b)))break;d+=f()}d={type:o.w,value:parseInt(d,16)};break a}for(;n<D;){b=x[n];if(!T(b))break;d+=f()}}if("."===b)for(d+=f();n<D;){b=x[n];if(!T(b))break;d+=f()}if("e"===b||"E"===b)if(d+=f(),b=x[n],"+"===b||"-"===
b||T(b))for(d+=f();n<D;){b=x[n];if(!T(b))break;d+=f()}else y(E.U,r,"ILLEGAL");d={type:o.w,value:parseFloat(d)}}return d}d=x[n];if(Y(d)){for(b=f();n<D;){d=x[n];if(!(Y(d)||"0"<=d&&"9">=d))break;b+=f()}if(1===b.length)b={type:o.a,value:b};else{b:{switch(b){case "break":case "case":case "catch":case "continue":case "debugger":case "default":case "delete":case "do":case "else":case "finally":case "for":case "function":case "if":case "in":case "instanceof":case "new":case "return":case "switch":case "this":case "throw":case "try":case "typeof":case "var":case "void":case "while":case "with":case "class":case "const":case "enum":case "export":case "extends":case "import":case "super":case "implements":case "interface":case "let":case "package":case "private":case "protected":case "public":case "static":case "yield":d=
z;break b}d=O}b=d?{type:o.v,value:b}:"null"===b?{type:o.ia}:"true"===b||"false"===b?{type:o.Z,value:b}:{type:o.a,value:b}}a=b}else a=t;if("undefined"!==typeof a)return a;y(E.U,r,"ILLEGAL")}function k(){var a,b;if(A)return n=A.f[1],r=A.lineNumber,b=A,A=I,b;A=I;M();a=n;b=ga();b.f=[a,n];b.lineNumber=r;return b}function F(){var a,b,d;if(A!==I)return A;a=n;b=r;d=k();n=a;r=b;return A=d}function $(){var a,b,d;a=n;b=r;M();d=r!==b;n=a;r=b;return d}function y(a,b){var d=Array.prototype.slice.call(arguments,
2);l(Error("Line "+b+": "+a.replace(/%(\d)/g,function(a,b){return d[b]||""})))}function H(a){a.type===o.t&&y(E.Ja,r);a.type===o.w&&y(E.La,r);a.type===o.L&&y(E.Na,r);a.type===o.a&&y(E.Ka,r);a.type===o.v&&y(E.Ma,r);a=a.value;10<a.length&&(a=a.substr(0,10)+"...");y(E.U,r,a)}function q(a){var b=k();(b.type!==o.e||b.value!==a)&&H(b)}function v(a){var b=k();(b.type!==o.v||b.value!==a)&&H(b)}function i(a){var b=F();return b.type===o.e&&b.value===a}function s(a){var b=F();return b.type===o.v&&b.value===a}
function Q(a){return a.type===e.a||a.type===e.o||a.type===e.k||a.type===e.Q}function G(){var a;";"===x[n]?k():(a=r,M(),r===a&&(i(";")?k():(a=F(),a.type!==o.t&&!i("}")&&H(a))))}function K(){var a;if(i("[")){a=[];for(q("[");n<D;){if(i("]")){k();break}if(i(","))k(),a.push(t);else{a.push(j());if(i("]")){k();break}q(",")}}return{type:e.C,elements:a}}if(i("{")){var b=[],d;for(q("{");n<D;){a=k();if(a.type===o.e&&"}"===a.value)break;d={};switch(a.type){case o.a:d.key={type:e.a,name:a.value};if("get"===a.value&&
!i(":")){a=k();a.type!==o.a&&H(a);q("(");q(")");d={key:{type:e.a,name:a.value},value:{type:e.n,id:I,p:[],body:w()},P:"get"};break}if("set"===a.value&&!i(":")){a=k();a.type!==o.a&&H(a);d.key={type:e.a,name:a.value};q("(");a=k();a.type!==o.a&&H(a);q(")");d.value={type:e.n,id:I,p:[{type:e.a,name:a.value}],body:w()};d.P="set";break}q(":");d.value=j();break;case o.L:case o.w:d.key={type:e.h,value:a.value};q(":");d.value=j();break;default:H(a)}b.push(d);a=F();if(a.type===o.e&&"}"===a.value){k();break}q(",")}return{type:e.R,
Aa:b}}if(i("("))return k(),a=u(),q(")"),a.b;if(s("function")){a=I;b=[];v("function");i("(")||(d=k(),d.type!==o.a&&H(d),a={type:e.a,name:d.value});q("(");if(!i(")"))for(;n<D;){d=k();d.type!==o.a&&H(d);b.push({type:e.a,name:d.value});if(i(")"))break;q(",")}q(")");d=w();return{type:e.n,id:a,p:b,body:d}}if(s("this"))return k(),{type:e.la};if(i("/")||i("/="))return{type:e.h,value:Z().value};a=k();return a.type===o.a?{type:e.a,name:a.value}:a.type===o.Z?{type:e.h,value:"true"===a.value}:a.type===o.ia?{type:e.h,
value:I}:a.type===o.w?{type:e.h,value:a.value}:a.type===o.L?{type:e.h,value:a.value}:H(a)}function aa(){return K()}function ba(){var a=[];q("(");if(!i(")"))for(;n<D;){a.push(j());if(i(")"))break;q(",")}q(")");return a}function ja(){var a,b,d;if(a=s("new"))k(),b=ja();else{var g;for(b=aa();n<D;)if(i("."))k(),g=k(),g.type!==o.a&&H(g),g={type:e.a,name:g.value},b={type:e.o,W:O,object:b,d:g};else if(i("["))k(),g=u(),g.type===e.H&&(g=g.b),b={type:e.o,W:z,object:b,d:g},q("]");else if(i("("))b={type:e.k,callee:b,
arguments:ba()};else break}i("(")&&(d=ba());return a?("undefined"===typeof d&&(d=[]),b.type===e.k&&(d=b.arguments,b=b.callee),{type:e.Q,callee:b,arguments:d}):"undefined"!==typeof d?{type:e.k,callee:b,arguments:d}:b}function R(){var a,b;if(i("++")||i("--"))return a=k().value,b=R(),Q(b)||y(E.Fa,r),{type:e.N,c:a,g:b,prefix:z};if(i("+")||i("-")||i("~")||i("!"))a={type:e.M,c:k().value,g:R()};else if(s("delete")||s("void")||s("typeof"))a={type:e.M,c:k().value,g:R()};else if(a=ja(),(i("++")||i("--"))&&
!$())Q(a)||y(E.Ea,r),a={type:e.N,c:k().value,g:a,prefix:O};return a}function ka(){for(var a=R();i("*")||i("/")||i("%");)a={type:e.j,c:k().value,left:a,right:R()};return a}function U(){for(var a=ka();i("+")||i("-");)a={type:e.j,c:k().value,left:a,right:ka()};return a}function c(){var a;for(a=U();i("<<")||i(">>")||i(">>>");)a={type:e.j,c:k().value,left:a,right:U()};i("<")||i(">")||i("<=")||i(">=")?a={type:e.j,c:k().value,left:a,right:c()}:s("in")?(k(),a={type:e.j,c:"in",left:a,right:c()}):s("instanceof")&&
(k(),a={type:e.j,c:"instanceof",left:a,right:c()});return a}function W(){for(var a=c();i("==")||i("!=")||i("===")||i("!==");)a={type:e.j,c:k().value,left:a,right:c()};return a}function ha(){for(var a=W();i("&");)k(),a={type:e.j,c:"&",left:a,right:W()};return a}function V(){for(var a=ha();i("|");)k(),a={type:e.j,c:"|",left:a,right:ha()};return a}function ia(){for(var a=V();i("^");)k(),a={type:e.j,c:"^",left:a,right:V()};return a}function ca(){for(var a=ia();i("&&");)k(),a={type:e.J,c:"&&",left:a,right:ia()};
return a}function j(){var a;for(a=ca();i("||");)k(),a={type:e.J,c:"||",left:a,right:ca()};i("?")&&(k(),a={type:e.aa,test:a},a.r=j(),q(":"),a.z=j());var b=F(),d=b.value;if(b.type!==o.e?0:"="===d||"*="===d||"/="===d||"%="===d||"+="===d||"-="===d||"<<="===d||">>="===d||">>>="===d||"&="===d||"^="===d||"|="===d)Q(a)||y(E.Ca,r),a={type:e.D,c:k().value,left:a,right:j()};return a}function u(){var a=j();if(i(","))for(a={type:e.S,sa:[a]};n<D&&i(",");)k(),a.sa.push(j());return{type:e.H,b:a}}function w(){q("{");
for(var a=[],b;n<D&&!i("}");){b=B();if("undefined"===typeof b)break;a.push(b)}q("}");return{type:e.Y,body:a}}function J(){var a,b;a=k();a.type!==o.a&&H(a);a={type:e.a,name:a.value};b=I;i("=")&&(k(),b=j());return{id:a,B:b}}function la(){for(var a=[];n<D;){a.push(J());if(!i(","))break;k()}return a}function g(){var a,b=I;v("continue");if(";"===x[n])return k(),{type:e.G,label:I};if($())return{type:e.G,label:I};a=F();a.type===o.a&&(k(),b={type:e.a,name:a.value});G();return{type:e.G,label:b}}function p(){var a,
b=I;v("break");if(";"===x[n])return k(),{type:e.F,label:I};if($())return{type:e.F,label:I};a=F();a.type===o.a&&(k(),b={type:e.a,name:a.value});G();return{type:e.F,label:b}}function m(){var a,b=I;v("return");if(" "===x[n]&&Y(x[n+1]))return b=u().b,G(),{type:e.K,g:b};if($())return{type:e.K,g:I};i(";")||(a=F(),!i("}")&&a.type!==o.t&&(b=u().b));G();return{type:e.K,g:b}}function ea(){for(var a=[],b;n<D&&!i("}")&&!s("default")&&!s("case");){b=B();if("undefined"===typeof b)break;a.push(b)}return a}function B(){var a=
F(),b;if(a.type!==o.t){if(a.type===o.e)switch(a.value){case ";":return q(";"),{type:e.da};case "{":return w();case "(":return b=u(),G(),b}if(a.type===o.v)switch(a.value){case "break":return p();case "continue":return g();case "debugger":return v("debugger"),G(),{type:e.ba};case "do":var d;v("do");b=B();v("while");q("(");d=u().b;q(")");G();return{type:e.ca,body:b,test:d};case "for":var h,c,j;h=c=a=I;v("for");q("(");if(i(";"))k();else if(s("var")||s("let")?(h=k().value,h={type:e.O,X:la(),P:h},s("in")&&
(k(),b=h,d=u().b,h=I)):h=u().b,"undefined"===typeof b)h.hasOwnProperty("operator")&&"in"===h.c?(b=h.left,d=h.right,h=I,Q(b)||y(E.Da,r)):q(";");if("undefined"===typeof b&&(i(";")||(c=u().b),q(";"),!i(")")))a=u().b;q(")");j=B();return"undefined"===typeof b?{type:e.fa,B:h,test:c,update:a,body:j}:{type:e.ea,left:b,right:d,body:j,Ya:O};case "if":return v("if"),q("("),b=u().b,q(")"),d=B(),s("else")?(k(),c=B()):c=I,{type:e.ga,test:b,r:d,z:c};case "let":return v("let"),b=la(),G(),{type:e.O,X:b,P:"let"};case "return":return m();
case "switch":v("switch");q("(");b=u().b;q(")");q("{");if(i("}"))k(),b={type:e.T,ra:b};else{for(d=[];n<D&&!i("}");)s("default")?(k(),c=I):(v("case"),c=u().b),q(":"),d.push({type:e.ka,test:c,r:ea()});q("}");b={type:e.T,ra:b,va:d}}return b;case "throw":return v("throw"),$()&&y(E.Ha,r),b=u().b,G(),{type:e.ma,g:b};case "try":return d=[],a=I,v("try"),b=w(),s("catch")&&(k(),q("("),i(")")||(c=u().b),q(")"),d.push({type:e.$,ya:c,Ra:I,body:w()})),s("finally")&&(k(),a=w()),0===d.length&&!a&&y(E.Ia,r),{type:e.na,
ua:b,Sa:d,wa:a};case "var":return v("var"),b=la(),G(),{type:e.O,X:b,P:"var"};case "while":return v("while"),q("("),b=u().b,q(")"),d=B(),{type:e.oa,test:b,body:d};case "with":return v("with"),q("("),b=u().b,q(")"),d=B(),{type:e.pa,object:b,body:d}}b=u();if(b.b.type===e.n&&b.b.id!==I)return{type:e.I,id:b.b.id,p:b.b.p,body:b.b.body};if(b.b.type===e.a&&i(":"))return k(),{type:e.ha,label:b.b,body:B()};G();return b}}function L(){var a,b,d,e,g;a="";for(g=e=O;n<D;)if(b=x[n],g)b=f(),P(b)?(g=O,r+=1,C.A.push({f:[d,
n-1],type:"Line",value:a}),a=""):a+=b;else if(e)b=f(),a+=b,"*"===b?(b=x[n],"/"===b&&(a=a.substr(0,a.length-1),e=O,f(),C.A.push({f:[d,n-1],type:"Block",value:a}),a="")):P(b)&&(r+=1);else if("/"===b)if(b=x[n+1],"/"===b)d=n,f(),f(),g=z;else if("*"===b)d=n,f(),f(),e=z;else break;else if(da(b))f();else if(P(b))f(),r+=1;else break;0<a.length&&C.A.push({f:[d,n],type:e?"Block":"Line",value:a})}function N(a){switch(a){case o.Z:return"Boolean";case o.a:return"Identifier";case o.v:return"Keyword";case o.ia:return"Null";
case o.w:return"Numeric";case o.e:return"Punctuator";case o.L:return"String";default:l(Error("Unknown token type"))}}function h(){var a,b;if(A)return n=A.f[1],r=A.lineNumber,b=A,A=I,b;A=I;M();a=n;b=ga();b.f=[a,n];b.lineNumber=r;b.type!==o.t&&C.m.push({type:N(b.type),value:x.slice(a,n),f:[a,n-1]});return b}function X(){var a,b,d;M();a=n;b=C.ta();0<C.m.length&&(d=C.m[C.m.length-1],d.f[0]===a&&"Punctuator"===d.type&&("/"===d.value||"/="===d.value)&&C.m.pop());C.m.push({type:"RegularExpression",value:b.Ta,
f:[a,n-1]});return b}function pa(){var a,b;M();a=n;b=K();b.f=[a,n-1];return b}function qa(a){function b(a,b){if(a.hasOwnProperty("range")&&b.hasOwnProperty("range"))return[a.f[0],b.f[1]]}ma(a,function(a){"BinaryExpression"===a.type&&!a.hasOwnProperty("range")&&(a.f=b(a.left,a.right));"LogicalExpression"===a.type&&(a.f=b(a.left,a.right))});return a}function na(a,b){var d,g;d=b||{};x=a;n=0;r=0<x.length?1:0;D=x.length;A=I;C={};"boolean"===typeof d.Pa&&d.Pa&&(C.Ba=M,M=L,C.A=[]);"boolean"===typeof d.f&&
d.f&&(C.za=aa,aa=pa);"boolean"===typeof d.m&&d.m&&(C.xa=k,C.ta=Z,k=h,Z=X,C.m=[]);try{for(var c=e.ja,p,m=[];n<D;){if(F().type!==o.t){var j=t;if(s("function")){var V=t,f=I,ia=[],u=t;v("function");V=k();V.type!==o.a&&H(V);f={type:e.a,name:V.value};q("(");if(!i(")"))for(;n<D;){V=k();V.type!==o.a&&H(V);ia.push({type:e.a,name:V.value});if(i(")"))break;q(",")}q(")");u=w();j={type:e.I,id:f,p:ia,body:u}}else j=B();p=j}else p=t;if("undefined"===typeof p)break;m.push(p)}g={type:c,body:m};"undefined"!==typeof C.A&&
(g.A=C.A);"undefined"!==typeof C.m&&(g.m=C.m);"boolean"===typeof d.f&&d.f&&(g=qa(g))}catch(ca){l(ca)}finally{"function"===typeof C.Ba&&(M=C.Ba),"function"===typeof C.za&&(aa=C.za),"function"===typeof C.xa&&(k=C.xa),"function"===typeof C.ta&&(Z=C.ta),C={}}return g}function oa(a,b){var d,e;if(b(a)!==O)for(d in a)a.hasOwnProperty(d)&&(e=a[d],"object"===typeof e&&oa(e,b))}function ma(a,b){var d,e;for(d in a)a.hasOwnProperty(d)&&(e=a[d],"object"===typeof e&&ma(e,b));b(a)}var o,e,E,x,n,r,D,A,C;o={Z:1,t:2,
a:3,v:4,ia:5,w:6,e:7,L:8};e={D:1,C:2,Y:3,j:4,F:5,k:6,$:7,aa:8,G:9,ca:10,ba:11,da:12,H:13,fa:14,ea:15,I:16,n:17,a:18,ga:19,h:20,ha:21,J:22,o:23,Q:24,R:25,ja:26,K:27,S:28,T:29,ka:30,la:31,ma:32,na:33,M:34,N:35,O:36,oa:37,pa:38};S.Va=e;E={U:"Unexpected token %0",La:"Unexpected number",Na:"Unexpected string",Ka:"Unexpected identifier",Ma:"Unexpected reserved word",Ja:"Unexpected end of input",Ha:"Illegal newline after throw",Ga:"Invalid regular expression",Oa:"Invalid regular expression: missing /",Ca:"Invalid left-hand side in assignment",
Da:"Invalid left-hand side in for-in",Ea:"Invalid left-hand side expression in postfix operation",Fa:"Invalid left-hand side expression in prefix operation",Ia:"Missing catch or finally after try"};"function"===typeof Object.freeze&&(Object.freeze(o),Object.freeze(e),Object.freeze(E));S.version="0.9.5";S.parse=na;S.$a=function(a,b,d){typeof b==="undefined"&&l(Error("Wrong use of traverse() function"));if(typeof d==="undefined"){d=b;b={}}a=na(a,b);oa(a,d);return a}})("undefined"===typeof exports?esprima=
{}:exports);
(function(){var S,T,da,P,Y,f,M,fa,Z,ga,k;function F(c){var i;try{i=new ActiveXObject("Msxml2.XMLHTTP")}catch(f){try{i=new ActiveXObject("Microsoft.XMLHTTP")}catch(j){i=O}}!i&&"undefined"!=typeof XMLHttpRequest&&(i=new XMLHttpRequest);i.open("GET",c,O);i.send(I);return i.responseText}function $(c){var i=[],c=c.replace("\\","/").split("/"),f;for(f in c)".."==c[f]?i.pop():i.push(c[f]);return i.join("/")}function y(){return{d:{},u:{},l:{},depth:-1}}function H(){var c,i,f,j,k,w=arguments[0]||{},J=1,y=
arguments.length,g=O;"boolean"===typeof w&&(g=w,w=arguments[1]||{},J=2);"object"!==typeof w&&"function"!==q(w)&&(w={});y===J&&(w=this,--J);for(;J<y;J++)if((c=arguments[J])!=I)for(i in c)f=w[i],j=c[i],w!==j&&(g&&j&&(v(j)||(k="array"===q(j)))?(k?(k=O,f=f&&"array"===q(f)?f:[]):f=f&&v(f)?f:{},w[i]=H(g,f,j)):j!==t&&(w[i]=j));return w}function q(c){return c==I?""+c:R[ka.call(c)]||"object"}function v(c){if(!c||"object"!==q(c)||c.nodeType||c&&"object"===typeof c&&"setInterval"in c)return O;try{if(c.constructor&&
!U.call(c,"constructor")&&!U.call(c.constructor.prototype,"isPrototypeOf"))return O}catch(i){return O}for(var f in c);return f===t||U.call(c,f)}function i(){ba&&K.apply(I,arguments)}function s(c,i){for(var f in i)c[f]=i[f]}function Q(c,i){s(c.d,i.d);s(c.u,i.u);s(c.l,i.l);c.depth=i.depth;return c}function G(c){return c+"$"}function K(c,i,f,j,k,w){switch(arguments.length){case 1:console.log(c);break;case 2:console.log(c,i);break;case 3:console.log(c,i,f);break;case 4:console.log(c,i,f,j);break;case 5:console.log(c,
i,f,j,k);break;default:console.log(arguments)}}function aa(c){for(var c=c.split(/(\\|\/)/),i="",f=0;f<c.length-1;++f)if(c[f].length&&(!("/"==c[f]||"\\"==c[f])||!i.length))i+=c[f]+("/"!=c[f]?"/":"");return("/"==c[0]||"\\"==c[0]?"/":"")+i}var ba=O,ja="_"+(new Date).getTime(),R={},ka=Object.prototype.toString,U=Object.prototype.hasOwnProperty;(function(){for(var c="Boolean,Number,String,Function,Array,Date,RegExp,Object".split(","),i=0,f=c.length;i<f;++i)R["[object "+c[i]+"]"]=c[i].toLowerCase()})();
var c=esprima.Va;S="Define";T="Enum";da="Undef";P="Include";Y="If";f="Endif";M="Elseif";fa="Ifdef";Z="__";ga="__FILE__";k="__LINE__";var W=[],ha={s:0};(function(){function q(j,u,w,J,v,g){function p(a){A.push(D);D=a}function m(){D=A.length?A.pop():v}function ea(){C.push(x);x=z}function B(a){if(D&&u){switch(r.substr(-2,2)){case ";\n":return;case "}\n":a&&(r=r.substr(0,r.length-1)+";\n");return}h(";\n")}}function L(a){return"//"+E+"// "+a}function y(){D&&h("\n")}function h(a){r+=a;g.s++}function X(a){var b=
a.object;return b&&b.type==c.o?X(b):a}function F(a){for(var b=0;b<a.length;++b)e(a[b]),b!=a.length-1&&h(", ")}function R(a){function b(a){a.type==c.D||a.type==c.j||a.type==c.N||a.type==c.M||a.type==c.J?(h("("),e(a),h(")")):e(a)}if(!J){var d=G(s(a,g)),f=w.d[d];if(f&&!f.q[d+"#"+g.s]){f.q[d+"#"+g.s]=1;e(f);return}var f=a.d,j;if(f.type==c.a&&(d=f.name+"$",f=w.d[d]))d=X(f),d.object&&d.object.name==Z&&(ba&&(j=s(a,g)),a.W=f.W,a.d=f.d,i(L(j+" ==> "+s(a,g))))}p(O);j=a.object;a.W?(b(j),h("["),e(a.d),h("]")):
(b(j),h("."),e(a.d));m();B()}function Q(a){if(x)ea();else{a=a.arguments[0];try{eval(q(a,z,w,O,D,g))||ea()}catch(b){l(b)}}}function U(a){var b=a.callee;if(b.type==c.a){switch(b.name){case f:x=C.length?C.pop():O;return;case M:a.arguments.length&&l(Error("Parametric ElseIf unsupported!"));len=C.length;if(!x||C[len-1]===O)x=!x;return;case Y:Q(a);return;case fa:if(x)ea();else{a=a.arguments[0];try{w.d[a.name+"$"]||ea()}catch(d){l(d)}}return}if(x)return;switch(b.name){case P:J||(a=a.arguments,a.length&&
(a=a[0].value,W.push(aa(a)),a=a.replace(/^.*[\\\/]/,""),""==a&&(a=Preprocessor.defaultInclude),a=$(W.join("")+a),(b=w.l[a])?b.Xa?console:b.Ua?K("<include: "+a+"> skipped. "):(b.Xa=z,n=a,e(b),n=""):console.warn("<include: "+a+"> not found."),W.pop()));return;case da:J||(a=a.arguments,b=s(a[0],g),a[0].type==c.k?(b=Preprocessor.i(a[0].callee,O),b+="+"+a[0].arguments.length,delete w.u[b]):delete w.d[b+"$"]);return;case S:case T:return}}if(!x){if(!J){var j=s(b,
g)+"+"+a.arguments.length,k=w.u[j];if(k&&!k.q[j+"#"+g.s]){var o=k.V,r=a.arguments,u,y,v;if(o.length==r.length){++w.depth;y={};v={};k.q[j+"#"+g.s]=1;for(var b=w.d,A=0;A<o.length;++A){u=o[A].Wa;var E=o[A].name+"$";if(b[E]){if(0<w.depth){var N=G(s(r[A],g));r[A]=H(z,{},b[N])}else N=L("::erase arg <"+o[A].name+"> ("+s(b[E],g)+" ==> "+s(r[A],g)+") in call: "+j),console.warn(N);y[E]=b[E]}else y[E]=I;u&&(r[A]={type:"Literal",value:q(r[A],O,w,O,D,g)});v[E]=r[A];v[E].q={}}for(A in v)b[A]=v[A];j=q(k.rel.body.body,
z,w,O,D,g);for(A in y)y[A]!=I?b[A]=y[A]:delete b[A];i(L(s(a,g)+" ==> "+j));--w.depth;h(j);return}}}a.callee.type!=c.n?(p(O),e(a.callee),h("("),F(a.arguments),h(")"),m()):(h("("),e(a.callee),h(")"),h("("),p(O),F(a.arguments),m(),h(")"));B()}}function ca(a,b){b||O||h("function");h("(");p(O);F(a.p);m();h(")");p(z);e(a.body);m()}function o(a){function b(a){a.type==c.S?(h("("),e(a),h(")")):e(a)}p(O);h("(");e(a.test);h("? ");b(a.r);h(" : ");b(a.z);h(")");m();B()}function e(a){if(a)if(a instanceof Array)for(var b=
0;b<a.length;++b)e(a[b]);else if(x)a.type==c.k?U(a):a.type==c.H&&(e(a.b),B(1));else switch(a.type){case c.D:p(O);e(a.left);h(" "+a.c+" ");e(a.right);m();B();break;case c.C:h("[");p(O);F(a.elements);m();h("]");B();break;case c.Y:h(" {\n");p(z);e(a.body);h("\n}\n");m();break;case c.j:p(O);var b=a.left.type,d=a.right.type;b==c.a||b==c.h?e(a.left):(h("("),e(a.left),h(")"));h(" "+a.c+" ");d==c.a||d==c.h?e(a.right):(h("("),e(a.right),h(")"));m();B();break;case c.F:h("break ");p(O);e(a.label);m();B();break;
case c.k:U(a);break;case c.$:h("catch");h("(");p(O);e(a.ya);m();h(")");p(z);e(a.body);m();break;case c.aa:o(a);break;case c.G:h("continue ");p(O);e(a.label);m();B();break;case c.ca:h("do");p(z);e(a.body);m();h("while");h("(");p(O);e(a.test);m();h(")");y();break;case c.ba:h("debugger");B();break;case c.da:B();break;case c.H:e(a.b);B(1);break;case c.fa:h("for ");p(O);h("(");e(a.B);h("; ");e(a.test);h("; ");e(a.update);h(")");m();p(z);e(a.body);m();y();break;case c.ea:h("for ");p(O);h("(");e(a.left);
h(" in ");e(a.right);h(")");m();p(z);e(a.body);m();y();break;case c.I:h("function ");p(O);e(a.id);m();h("(");p(O);F(a.p);m();h(")");p(z);e(a.body);m();y();break;case c.n:ca(a);break;case c.a:a:{b=a.name;if(!J){var d=b+"$",f=w.d[d];if(f&&!f.q[d+"#"+g.s]){f.q[d+"#"+g.s]=1;if(f.type!=c.o){i(L(s(a,g)+" ==> "+s(f,g)));f.type!=c.a&&f.type!=c.I&&f.type!=c.n&&f.type!=c.R&&f.type!=c.C&&f.type!=c.k&&f.type!=c.h?(h("("),e(f),h(")")):e(f);break a}if(X(f).object.name!=Z){e(f);break a}}}b==ga?h('"'+n+'"'):b==k?
h('""'):h(b);B()}break;case c.ga:p(O);h("if (");e(a.test);h(")");m();p(z);e(a.r);a.z&&(h("else "),e(a.z));m();y();break;case c.h:"string"==typeof a.value?(a=(""+a.value).replace(/\\"/g,'"').replace(/"/g,'\\"').replace(/\n/g,""),h('"'+a+'"')):h(a.value);B();break;case c.ha:b=a.label;p(O);e(b);h(":\n");e(a.body);m();break;case c.J:b=a.left.type;d=a.right.type;p(O);b==c.a||b==c.h?e(a.left):(h("("),e(a.left),h(")"));h(" "+a.c+" ");d==c.a||d==c.h?e(a.right):(h("("),e(a.right),h(")"));m();B();break;case c.o:R(a);
break;case c.Q:h("new ");p(O);b=a.callee;J?(b.type==c.a||b.type==c.o?e(b):(h("("),e(b),h(")")),h("("),F(a.arguments),h(")")):(d=q(b,O,w,O,O,g),b.type!=c.a&&b.type!=c.o&&(d="("+d+")"),a=H(z,{},a),a.callee={type:c.a,name:d},a.type=c.k,e(a));m();B();break;case c.R:b=a.Aa;h(" {");p(O);for(d=0;d<b.length;++d)(f=b[d].P)?"get"==f||"set"==f?(b[d].value.type!=c.n&&l(Error("unsupported getter")),h(f+" "),e(b[d].key),h(" "),ca(b[d].value,z)):(K(a),l(Error("unsupported <kind: "+f+"> of object member"))):(e(b[d].key),
h(": "),e(b[d].value)),d!=b.length-1&&h(", ");m();h("}");B();break;case c.ja:e(a.body);break;case c.K:h("return ");p(O);e(a.g);m();B();break;case c.S:p(O);F(a.sa);m();break;case c.T:h("switch");h("(");p(O);e(a.ra);m();h(")");h(" {");e(a.va);h("}");y();break;case c.ka:p(O);a.test==I?h("\ndefault:\n"):(h("\ncase "),e(a.test),h(":\n"));m();p(z);e(a.r);m();B();break;case c.la:h("this");break;case c.ma:h("throw ");e(a.g);B();break;case c.na:h("try");p(z);e(a.ua);e(a.Sa);a.wa&&(h("finally"),e(a.wa));m();
B();break;case c.M:h(a.c);1<a.c.length&&h(" ");b=a.g.type;p(O);b==c.a||b==c.h?e(a.g):(h("("),e(a.g),h(")"));m();B();break;case c.N:a.prefix&&h(a.c);p(O);e(a.g);m();a.prefix||h(a.c);B();break;case c.O:a=a.X;h("var ");p(O);for(b=0;b<a.length;++b)d=a[b],e(d.id),d.B&&(h("="),e(d.B)),b!=a.length-1&&h(", ");m();B(z);break;case c.oa:h("while ");h("(");p(O);e(a.test);m();h(")");p(z);e(a.body);m();break;case c.pa:h("with ");h("(");p(O);e(a.object);m();h(")");p(z);e(a.body);m();break;default:console.log("TODO: unsupported code structure"),
K(a)}}var u=u===t?z:u,J=J===t?z:J,w=w||I,E=ba?Math.floor(1E6*Math.random()):"",x=O,v=v===t?z:v,n="",r="",D=v,A=[],C=[];e(j);return r}function s(c,f){return q(c,O,I,z,z,f)}var v=y();Preprocessor.i=function(c,f,i,k,s){k===z&&(v=y());i&&(v=Q(v,i));ha.s++;return q(c,f,v,i?O:z,s,ha)}})();(function(){function k(){G.push(s);s=z}function q(g){var g=g.arguments,f=Preprocessor.i(g[0],O);if(g[0].type==c.k){var f=Preprocessor.i(g[0].callee,O),i=g[0].arguments.length,j=f.replace(/\./g,"_")+"_"+i+ja,f=f+("+"+i);
if(w){for(var k=y(),s=0;s<i;++s){var v=g[0].arguments[s],h=v.name;"$$"==h.substr(0,2)&&(h=h.substr(2),v.Wa=z);v.name=j+"_"+h;v.q={};k.d[h+"$"]=v}i=Preprocessor.i(g[1].body,z,k,z,z);try{g[1].body.body=esprima.parse(i).body[0].body}catch(F){K("error after function modification, param name replacing..."),K(Preprocessor.i(g[1].body,z,I,z,z)),K(i),K(k),l(F)}}u.u[f]={V:g[0].arguments,rel:g[1],q:{}}}else f+="$",u.d[f]=g[1],u.d[f].q={}}function v(c){if(s)k();else{c=c.arguments[0];try{eval(Preprocessor.i(c,
z,u,O))||k()}catch(f){K("cannot eval If() statament with ignore: "+s),K(u),K("value:"),K(Preprocessor.i(c,z,u,O)),l(f)}}}function j(g){if(g)if(g instanceof Array)for(var p=0;p<g.length;++p)j(g[p]);else switch(g.type){case c.D:j(g.left);j(g.right);break;case c.C:j(g.elements);break;case c.Y:j(g.body);break;case c.j:j(g.left);j(g.right);break;case c.F:break;case c.k:a:{var m=g.callee;if(m&&m.type==c.a){if(m.name==M){if(g.arguments.length&&l(Error("Parametric ElseIf unsupported!")),len=G.length,!s||
G[len-1]===O)s=!s}else m.name==f&&(s=G.length?G.pop():O);if(m.name==Y)v(g);else if(m.name==fa)if(s)k();else{var y=g.arguments[0];try{u.d[y.name+"$"]||k()}catch(B){l(B)}}if(s)break a;if(m.name==S)q(g);else if(m.name!=da)if(m.name==T){var L=g.arguments;if(!(2>L.length)&&(p=L[0],p.type==c.C)){var N=0,m={type:c.k,callee:{type:c.a,name:S},arguments:[I,{type:c.h,value:0}]},y=I;2<L.length&&(y=Preprocessor.i(L[2],O));for(var p=p.elements,h=0;h<p.length;++h){var X=H(z,{},m);p[h].type==c.D?(L=p[h].left,N=Number(Preprocessor.i(p[h].right,
O,u))):L=p[h];if(y)try{L=esprima.parse(y+"."+Preprocessor.i(L,O)).body}catch(R){l(R)}X.arguments[0]=L;X.arguments[1].value=N;i("//"+("Enum: "+Preprocessor.i(L,O)+" : "+N));N++;q(X)}}}else if(m.name==P)b:if(m=g.arguments,m.length){m=m[0].value;W.push(aa(m));m=m.replace(/^.*[\\\/]/,"");""==m&&(m=Preprocessor.defaultInclude);m=$(W.join("")+m);if(!u.l[m]){try{p=F(m)}catch(Q){Q instanceof SyntaxError||l(Q)}if(!p.length)break b;try{N=esprima.parse(p)}catch(U){K("ERROR:: syntax error in: "+m),l(U)}u=Preprocessor.qa(N,
u,w);u.l[m]=N.body}W.pop()}}else j(g.callee);j(g.arguments)}break;case c.$:j(g.ya);j(g.Ra);j(g.body);break;case c.aa:j(g.test);j(g.r);j(g.z);break;case c.G:break;case c.ca:j(g.body);j(g.test);break;case c.ba:break;case c.da:break;case c.H:j(g.b);break;case c.fa:j(g.B);j(g.test);j(g.update);j(g.body);break;case c.ea:j(g.left);j(g.right);j(g.body);break;case c.I:j(g.p);j(g.body);break;case c.n:j(g.p);j(g.body);break;case c.a:break;case c.ga:j(g.test);j(g.r);j(g.z);break;case c.h:break;case c.ha:j(g.body);
break;case c.J:j(g.left);j(g.right);break;case c.o:j(g.object);break;case c.Q:j(g.arguments);break;case c.R:g=g.Aa;for(p=0;p<g.length;++p)j(g[p].key),j(g[p].value);break;case c.ja:j(g.body);break;case c.K:j(g.g);break;case c.S:j(g.sa);break;case c.T:j(g.ra);j(g.va);break;case c.ka:j(g.test);j(g.r);break;case c.la:break;case c.ma:j(g.g);break;case c.na:j(g.ua);break;case c.M:j(g.g);break;case c.N:j(g.g);break;case c.O:g=g.X;for(p=0;p<g;++p)j(g[p].id),j(g[p].B);break;case c.oa:j(g.test);j(g.body);break;
case c.pa:j(g.object);j(g.body);break;default:console.log("unknown syntax structure founded:"),console.log(g)}}var u,w,s,G=[];Preprocessor.qa=function(c,f,m){s=O;G=[];w=m===t?z:m;i("SubstArg: "+w);m=y();u=f?Q(m,f):m;j(c);return u};Preprocessor.code=function(c,f){ba=Preprocessor.debug;W=[];try{var j=esprima.parse(c)}catch(k){l(k)}var q=Preprocessor.qa(j);Preprocessor.next=function(c){if("object"==typeof c&&c.l)for(var f in c.l)c.l[f]===O&&(q.l[f].Ua=z);i("=====> reflect starting...");i(q);return Preprocessor.i(j,
z,q,z)};if("object"==typeof f){var s={};if(f.l){var u=s.l={},h;for(h in q.l)u[h]=z}return s}return Preprocessor.next()};Preprocessor.file=function(c){return Preprocessor.code(F(c))};Preprocessor.watch=function(){var c=document.getElementsByTagName("script"),f="",i;for(i in c){var j=c[i];j.type==Preprocessor.scriptType&&(j.src&&(f+=F(j.src)),f+=j.innerHTML)}c=document.getElementsByTagName("head")[0];script=document.createElement("script");script.type="text/javascript";script.innerHTML=Preprocessor.code(f);
script.id="akra-js-"+(new Date).getTime();c.appendChild(script)};Preprocessor.extractMacro=function(c){var f;try{f=esprima.parse(c)}catch(i){K("esprima parse error: "),l(i)}Preprocessor.qa(f,I,O);var c="",j;for(j in u.d)c+=("Define("+j.substr(0,j.length-1)+","+Preprocessor.i(u.d[j],z,0,0,O)+")").replace(/(\r\n|\n|\r)/gm,"")+"\n";for(j in u.u){f=u.u[j];for(var k="",k=k+("Define("+j.substr(0,j.lastIndexOf("+"))+"("),q=0;q<f.V.length;++q)k+=Preprocessor.i(f.V[q],O)+(q!=f.V.length-1?",":"");k+="),function()"+Preprocessor.i(f.rel.body,
z,0,0,O)+")";c+=k.replace(/(\r\n|\n|\r)/gm,"")+"\n"}return c};Preprocessor.extractFileMacro=function(c){return this.extractMacro(F(c))};Preprocessor.watch()})()})("undefined"===typeof exports?Preprocessor={defaultInclude:"Include.js",debug:O,scriptType:"text/akra-js"}:exports);