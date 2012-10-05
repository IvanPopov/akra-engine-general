/// <reference path="node.d.ts" />
import akra = module("TIFFReader");


var fs = require('fs');

var pTiffData = fs.readFileSync('wear.TIF');

function toArrayBuffer(buffer):ArrayBuffer {
    var ab:ArrayBuffer = new ArrayBuffer(buffer.length);
    var view:Uint8Array = new Uint8Array(ab);
    
    for (var i:number = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }

    return ab;
}

var pTiffBuffer = toArrayBuffer(pTiffData);
var pReader = new akra.akra.TIFFReader();

pReader.parse(pTiffBuffer);