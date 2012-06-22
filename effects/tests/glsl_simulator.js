var fs = require('fs');
eval(fs.readFileSync('glsl_simulator_accessors.js', 'utf-8'));

var A_VB_ELEMENT_SIZE = 4;

function int32(v) {
    return Math.round(v);    
}

function vec2() {
    switch (arguments.length) {
        case 1:
            var v = arguments[0];
            if (typeof v === 'number')
                return [v, v];
            else
                return [v[0], v[1]];
        case 2:
            var x = arguments[0];
            var y = arguments[1];
            return [x, y];
    }
    return [0, 0];
}

function vec3() {
     switch (arguments.length) {
        case 1:
            var v = arguments[0];
            if (typeof v === 'number')
                return [v, v, v];
            else
                return [v[0], v[1], v[2]];
        case 2:
            var l = arguments[0];
            var r = arguments[1];
            if (typeof l === 'number') {
                return [l, r[0], r[1]];
            }
            else {
                return [l[0], l[1], r];
            }
        case 3:
            var r = arguments[0],
                g = arguments[1],
                b = arguments[2];
            return [r, g, b];
     }
     return [0, 0, 0];
}


function vec4() {
     switch (arguments.length) {
        case 1:
            var v = arguments[0];
            if (typeof v === 'number')
                return [v, v, v, v];
            else
                return [v[0], v[1], v[2], v[3]];
        case 2:
            var l = arguments[0];
            var r = arguments[1];
            if (typeof l === 'number') {
                return [l, r[0], r[1], r[2]];
            }
            else if (typeof r === 'number') {
                return [l[0], l[1], l[2], r];
            }
            else {
                return [l[0], l[1], r[0], r[1]];
            }
        case 3:
        case 4:
            var r = [];
            for (var i = 0; i < arguments.length; ++ i) {
                if (typeof arguments[i] === 'number') {
                    r.push(arguments[i]);
                }
                else {
                    for (var j = 0; j < arguments[i].length; ++ j) {
                        r.push(arguments[i][j]);
                    }
                }
            }
            return r;
     }
     return [0, 0, 0, 0];
}


//#define A_tex2D(S, H, X, Y) texture2D(S, vec2(H.stepX * X, 1. - H.stepY * Y))
//#define A_tex2D(S, H, X, Y) texture2D(S, vec2(H.stepX * X, H.stepY * Y))
 
function sampler2D(data, width, height) {
    this.data = data;
    this.width = width;
    this.height = height;
}

function texture2D (sampler, v2f) {
    var i = Math.floor(v2f.x * sampler.width) + Math.floor(v2f.y * sampler.height) * sampler.width;
    //console.log('texture2D', v2f, ' > ', i, [i * 4, i * 4 + 4]);
    var p = sampler.data.slice(i * 4, i * 4 + 4);
    //console.log(p);
    return p;
}

function floor (value) {
    return Math.floor(value);
}

function mod (f, t) {
    return f % t;
}
