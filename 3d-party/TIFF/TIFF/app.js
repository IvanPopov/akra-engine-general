var akra = require("./TIFFReader")
var fs = require('fs');
var pTiffData = fs.readFileSync('wear.TIF');
function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for(var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}
var pTiffBuffer = toArrayBuffer(pTiffData);
var pReader = new akra.akra.TIFFReader();
pReader.parse(pTiffBuffer);

