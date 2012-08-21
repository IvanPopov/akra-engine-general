function A_3DContextTracer () {
    Define(A_TR_NOTIFY(__ARGS__), function () {
        this.notify(__ARGS__);
    });

    Define(A_TR_CONST(iConst), function () {
        this.pContants[iConst];
    });


    this.pContext = null;
    this.pTimeline = null;
    this.pContants = {};
    this.nResources = 0;

    if (arguments.length) {
        this.setTimeline(arguments[0]);
    }
};

WebGLUniformLocation.prototype.toString = function () {
    return '[object WebGLUniformLocation [ ' + this.name + ' ]]';
};

Float32Array.prototype.toString = function () {
    var n = Math.min(32, this.length);
    var s = 'Float32Array [ ';
    for (var i = 0; i < n; i++) {
        s += this[i] + (i !== n - 1? ', ': '');
    }
    s += ' ]';
    return s;
};

Define(A_CLICKVIEW(text, data), function () {
    this.createResourceRef(text, data);
});

A_3DContextTracer.prototype.setTimeline = function (pTimeline) {
    this.pTimeline = pTimeline;
};

A_3DContextTracer.prototype.proxy = function (pContext) {
    this.pContext = pContext;
    for (var i in pContext) {
        if (typeof pContext[i] === 'number') {
            this[i] = pContext[i];
            this.pContants[pContext[i]] = i;
        }

        if (typeof pContext[i] === 'function') {
            var sFunc = (pContext[i].toString());
            var pMatches;
            if (pMatches = sFunc.match(/function\s*(\w+)/)) {
                if (this[pMatches[1]]) {
                    continue;
                }
                var sFuncName = pMatches[1];
                this[sFuncName] = function ( ) {
                    //console.log('unknown ', sFuncName);
                    A_TR_NOTIFY(A_HL_UNKNOWN('[ UNKNOWN ]' + sFuncName + ' ( ' + '... arguments[' + arguments.length + ']' + ' )'));
                    var arg = arguments;
                    pContext[sFuncName](arg[0], arg[1], arg[2], arg[3], arg[4], arg[5], arg[6], arg[7], arg[8]);
                };
            }
        }
    }
};
function addslashes (str) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}
A_3DContextTracer.prototype.createResourceRef = function (sText, pData) {
    //trace(pData.replace(/;/ig, ";\n"));
    return '<a href="javascript: alert(\'' + addslashes(pData) + '\');">' + sText + '</a>';
};

A_3DContextTracer.prototype.notify = function (sCall) {
    //var sFunc = (new Error()).stack.split('\n')[2];
    //sFunc = 'WEBGL::' + sFunc.substr(sFunc.indexOf('.') + 1, sFunc.indexOf('(') - sFunc.indexOf('.') - 1);
    var e = this.pContext.getError();
    if (e) {
        this.pTimeline.invalidCall((typeof e === 'number'? A_TR_CONST(e): 'ERR::' +  e));
    }

    this.pTimeline.graphicCall('WebGL :: ' + sCall);
};

//WEBGL funcs
A_3DContextTracer.prototype.getParameter = function (eParam) {
    A_TR_NOTIFY('getParameter ( ' + A_TR_CONST(eParam) + ' )');
    return this.pContext.getParameter(eParam);
};

//Viewing and clipping

A_3DContextTracer.prototype.viewport = function (iX, iY, iWidth, iHeight) {
    A_TR_NOTIFY('viewport ( ' + iX + ',' + iY + ',' + iWidth + ',' + iHeight + ' )');
    this.pContext.viewport(iX, iY, iWidth, iHeight);
};

A_3DContextTracer.prototype.scissor = function (iX, iY, iWidth, iHeight) {
    A_TR_NOTIFY('scissor ( ' + iX + ',' + iY + ',' + iWidth + ',' + iHeight + ' )');
    this.pContext.scissor(iX, iY, iWidth, iHeight);
};

//extentions

A_3DContextTracer.prototype.getSupportedExtensions = function () {
    var t = this.pContext.getSupportedExtensions();
    A_TR_NOTIFY('getSupportedExtensions ( ) : ' + A_HL_RESULT(t));
    trace(t);
    return t;
};

A_3DContextTracer.prototype.getExtension = function (sExtention) {
    A_TR_NOTIFY('getExtension ( ' + sExtention + ' )');
    return this.pContext.getExtension(sExtention);
};

//Buffers

A_3DContextTracer.prototype.createBuffer = function () {
    A_TR_NOTIFY('createBuffer (  )');
    return this.pContext.createBuffer();
};

A_3DContextTracer.prototype.bindBuffer = function (iTarget, pBuffer) {
    A_TR_NOTIFY('bindBuffer ( ' + A_TR_CONST(iTarget) + ', ' + pBuffer + ' )');
    this.pContext.bindBuffer(iTarget, pBuffer);
};

A_3DContextTracer.prototype.bufferData = function (iTarget, pData, eUsage) {
    A_TR_NOTIFY('bufferData ( ' + A_TR_CONST(iTarget) + ', ' + pData + ', ' + A_TR_CONST(eUsage) + ' )');
    this.pContext.bufferData(iTarget, pData, eUsage);
};

A_3DContextTracer.prototype.bufferSubData = function (iTarget, iOffset, pData) {
    A_TR_NOTIFY('bufferSubData ( ' + A_TR_CONST(iTarget) + ', ' + iOffset + ', ' + pData + ' )');
    this.pContext.bufferSubData(iTarget, iOffset, pData);
};

A_3DContextTracer.prototype.deleteBuffer = function (pBuffer) {
    A_TR_NOTIFY('deleteBuffer ( ' + pBuffer + ' )');
    this.pContext.deleteBuffer(pBuffer);
};

A_3DContextTracer.prototype.getBufferParameter = function (iTarget, eName) {
    A_TR_NOTIFY('getBufferParameter ( ' + iTarget + ', ' + A_TR_CONST(eName) + ' )');
    return this.pContext.getBufferParameter(iTarget, eName);
};

A_3DContextTracer.prototype.isBuffer = function (pBuffer) {
    A_TR_NOTIFY('isBuffer ( ' + pBuffer + ' )');
    return this.pContext.isBuffer(pBuffer);
};

//Setting and getting state

A_3DContextTracer.prototype.activeTexture = function (eTexture) {
    A_TR_NOTIFY('activeTexture ( ' + A_TR_CONST(eTexture) + ' )');
    return this.pContext.activeTexture(eTexture);
};

A_3DContextTracer.prototype.blendColor = function (r, g, b, a) {
    A_TR_NOTIFY('blendColor ( ' + r + ',' + g + ',' + b + ',' + a + ' )');
    return this.pContext.blendColor(r, g, b, a);
};

A_3DContextTracer.prototype.blendEquation = function (eMode) {
    A_TR_NOTIFY('blendEquation ( ' + A_TR_CONST(eMode) + ' )');
    return this.pContext.blendEquation(eMode);
};

A_3DContextTracer.prototype.blendEquationSeparate = function (eModeRGB, eModeAlpha) {
    A_TR_NOTIFY('blendEquationSeparate ( ' + A_TR_CONST(eModeRGB) + ', ' + A_TR_CONST(eModeAlpha) + ' )');
    return this.pContext.blendEquationSeparate(eModeRGB, eModeAlpha);
};

A_3DContextTracer.prototype.blendFunc = function (eSfactor, eDfactor) {
    A_TR_NOTIFY('blendFunc ( ' + A_TR_CONST(eSfactor) + ', ' + A_TR_CONST(eDfactor) + ' )');
    return this.pContext.blendFunc(eSfactor, eDfactor);
};

A_3DContextTracer.prototype.blendFuncSeparate = function (eSrcRGB, eDstRGB, eSrcAlpha, eDstAlpha) {
    A_TR_NOTIFY('blendFuncSeparate ( ' + A_TR_CONST(eSrcRGB) + ', ' + A_TR_CONST(eDstRGB) +
        ',' + A_TR_CONST(eSrcAlpha) + ', ' + A_TR_CONST(eDstAlpha) + ' )');
    return this.pContext.blendFuncSeparate(eSrcRGB, eDstRGB, eSrcAlpha, eDstAlpha);
};

A_3DContextTracer.prototype.clearColor = function (r, g, b, a) {
    A_TR_NOTIFY('clearColor ( ' + r + ', ' + g + ',' + b + ', ' + a + ' )');
    return this.pContext.clearColor(r, g, b, a);
};

A_3DContextTracer.prototype.clearDepth = function (depth) {
    A_TR_NOTIFY('clearDepth ( ' + depth + ' )');
    return this.pContext.clearDepth(depth);
};

A_3DContextTracer.prototype.clearStencil = function (s) {
    A_TR_NOTIFY('clearStencil ( ' + s + ' )');
    return this.pContext.clearStencil(s);
};

A_3DContextTracer.prototype.colorMask = function (r, g, b, a) {
    A_TR_NOTIFY('colorMask ( ' + r + ', ' + g + ',' + b + ', ' + a + ' )');
    return this.pContext.colorMask(r, g, b, a);
};

A_3DContextTracer.prototype.cullFace = function (eMode) {
    A_TR_NOTIFY('cullFace ( ' + A_TR_CONST(eMode) + ' )');
    return this.pContext.cullFace(eMode);
};

A_3DContextTracer.prototype.depthFunc = function (eFunc) {
    A_TR_NOTIFY('depthFunc ( ' + A_TR_CONST(eFunc) + ' )');
    return this.pContext.depthFunc(eFunc);
};

A_3DContextTracer.prototype.depthMask = function (bFlag) {
    A_TR_NOTIFY('depthMask ( ' + bFlag + ' )');
    return this.pContext.depthMask(bFlag);
};

A_3DContextTracer.prototype.depthRange = function (zNear, zFar) {
    A_TR_NOTIFY('depthRange ( ' + zNear + ', ' + zFar + ' )');
    return this.pContext.depthRange(zNear, zFar);
};

A_3DContextTracer.prototype.disable = function (eCap) {
    A_TR_NOTIFY('disable ( ' + eCap + ' )');
    return this.pContext.disable(eCap);
};

A_3DContextTracer.prototype.enable = function (eCap) {
    A_TR_NOTIFY('enable ( ' + eCap + ' )');
    return this.pContext.enable(eCap);
};

A_3DContextTracer.prototype.frontFace = function (eMode) {
    A_TR_NOTIFY('frontFace ( ' + eMode + ' )');
    return this.pContext.frontFace(eMode);
};

A_3DContextTracer.prototype.getError = function () {
    A_TR_NOTIFY('frontFace (  )');
    return this.pContext.getError();
};

A_3DContextTracer.prototype.hint = function (eTarget, eMode) {
    A_TR_NOTIFY('hint ( ' + A_TR_CONST(eTarget) + ', ' + A_TR_CONST(eMode) + ' )');
    return this.pContext.hint(eTarget, eMode);
};

A_3DContextTracer.prototype.lineWidth = function (fWidth) {
    A_TR_NOTIFY('lineWidth ( ' + fWidth + ' )');
    return this.pContext.lineWidth(fWidth);
};

A_3DContextTracer.prototype.pixelStorei = function (eParam, iParam) {
    A_TR_NOTIFY('pixelStorei ( ' + A_TR_CONST(eParam) + ', ' + iParam + ' )');
    return this.pContext.pixelStorei(eParam, iParam);
};

A_3DContextTracer.prototype.polygonOffset = function (fFactor, fUnits) {
    A_TR_NOTIFY('polygonOffset ( ' + fFactor + ', ' + fUnits + ' )');
    return this.pContext.polygonOffset(fFactor, fUnits);
};

A_3DContextTracer.prototype.sampleCoverage = function (fValue, bInvert) {
    A_TR_NOTIFY('sampleCoverage ( ' + fValue + ', ' + bInvert + ' )');
    return this.pContext.sampleCoverage(fValue, bInvert);
};

A_3DContextTracer.prototype.stencilFunc = function (eFunc, iRef, iMask) {
    A_TR_NOTIFY('stencilFunc ( ' + A_TR_CONST(eFunc) + ', ' + iRef + ', ' + iMask + ' )');
    return this.pContext.stencilFunc(eFunc, iRef, iMask);
};

A_3DContextTracer.prototype.stencilFuncSeparate = function (eFace, eFunc, iRef, iMask) {
    A_TR_NOTIFY('stencilFuncSeparate ( ' + A_TR_CONST(eFace) + ', ' + A_TR_CONST(eFunc) +
        ', ' + iRef + ', ' + iMask + ' )');
    return this.pContext.stencilFuncSeparate(eFace, eFunc, iRef, iMask);
};

A_3DContextTracer.prototype.stencilMask = function (iMask) {
    A_TR_NOTIFY('stencilMask ( ' + iMask + ' )');
    return this.pContext.stencilMask(iMask);
};

A_3DContextTracer.prototype.stencilMaskSeparate = function (eFace, iMask) {
    A_TR_NOTIFY('stencilMaskSeparate ( ' + A_TR_CONST(eFace) + ', ' + iMask + ' )');
    return this.pContext.stencilMaskSeparate(eFace, iMask);
};

A_3DContextTracer.prototype.stencilOp = function (eFail, eZfail, eZpass) {
    A_TR_NOTIFY('stencilOp ( ' + A_TR_CONST(eFail) + ', ' + A_TR_CONST(eZfail) + ', ' + A_TR_CONST(eZpass) + ' )');
    return this.pContext.stencilOp(eFail, eZfail, eZpass);
};

A_3DContextTracer.prototype.stencilOpSeparate = function (eFace, eFail, eZfail, eZpass) {
    A_TR_NOTIFY('stencilOpSeparate ( ' + A_TR_CONST(eFace) + ', ' + A_TR_CONST(eFail) + ', ' +
        A_TR_CONST(eZfail) + ', ' + A_TR_CONST(eZpass) + ' )');
    return this.pContext.stencilOpSeparate(eFace, eFail, eZfail, eZpass);
};

// Framebuffer object

A_3DContextTracer.prototype.bindFramebuffer = function (eTarget, pBuffer) {
    A_TR_NOTIFY('bindFramebuffer ( ' + A_TR_CONST(eTarget) + ', ' + pBuffer + ' )');
    return this.pContext.bindFramebuffer(eTarget, pBuffer);
};

A_3DContextTracer.prototype.checkFramebufferStatus = function (eTarget) {
    A_TR_NOTIFY('checkFramebufferStatus ( ' + A_TR_CONST(eTarget) + ' )');
    return this.pContext.checkFramebufferStatus(eTarget);
};

A_3DContextTracer.prototype.createFramebuffer = function () {
    A_TR_NOTIFY('createFramebuffer (  )');
    return this.pContext.createFramebuffer();
};

A_3DContextTracer.prototype.deleteFramebuffer = function (pBuffer) {
    A_TR_NOTIFY('deleteFramebuffer ( ' + pBuffer + ' )');
    return this.pContext.deleteFramebuffer(pBuffer);
};

A_3DContextTracer.prototype.framebufferRenderbuffer = function (eTarget, eAttachment, eRenderBufferTarget, pRenderBuffer) {
    A_TR_NOTIFY('framebufferRenderbuffer ( ' + A_TR_CONST(eTarget) + ', ' + A_TR_CONST(eAttachment) + ', ' +
                A_TR_CONST(eRenderBufferTarget) + ', ' + pRenderBuffer + ' )');
    return this.pContext.framebufferRenderbuffer(eTarget, eAttachment, eRenderBufferTarget, pRenderBuffer);
};

A_3DContextTracer.prototype.framebufferTexture2D = function (eTarget, eAttachment, eTextureTarget, pTexture, iLevel) {
    A_TR_NOTIFY('framebufferTexture2D ( ' + A_TR_CONST(eTarget) + ', ' + A_TR_CONST(eAttachment) + ', ' +
                A_TR_CONST(eTextureTarget) + ', ' + pTexture + ', ' + iLevel + ' )');
    return this.pContext.framebufferTexture2D(eTarget, eAttachment, eTextureTarget, pTexture, iLevel);
};

A_3DContextTracer.prototype.getFramebufferAttachmentParameter = function (eTarget, eAttachment, eName) {
    A_TR_NOTIFY('getFramebufferAttachmentParameter ( ' + A_TR_CONST(eTarget) + ', ' + A_TR_CONST(eAttachment) + ', ' +
                A_TR_CONST(eName) + ' )');
    return this.pContext.getFramebufferAttachmentParameter(eTarget, eAttachment, eName);
};

A_3DContextTracer.prototype.isFramebuffer = function (pBuffer) {
    A_TR_NOTIFY('isFramebuffer ( ' + pBuffer + ' )');
    return this.pContext.isFramebuffer(pBuffer);
};

// Renderbuffer objects

A_3DContextTracer.prototype.bindRenderbuffer = function (eTarget, pBuffer) {
    A_TR_NOTIFY('bindRenderbuffer ( ' + A_TR_CONST(eTarget) + ', ' + pBuffer + ' )');
    return this.pContext.bindRenderbuffer(eTarget, pBuffer);
};

A_3DContextTracer.prototype.createRenderbuffer = function () {
    A_TR_NOTIFY('createRenderbuffer (  )');
    return this.pContext.createRenderbuffer();
};

A_3DContextTracer.prototype.deleteRenderbuffer = function (pBuffer) {
    A_TR_NOTIFY('deleteRenderbuffer ( ' + pBuffer + ' )');
    return this.pContext.deleteRenderbuffer(pBuffer);
};

A_3DContextTracer.prototype.getRenderbufferParameter = function (eTarget, ePname) {
    A_TR_NOTIFY('getRenderbufferParameter ( ' + A_TR_CONST(eTarget) + ', ' + A_TR_CONST(ePname) + ' )');
    return this.pContext.getRenderbufferParameter(eTarget, ePname);
};

A_3DContextTracer.prototype.isRenderbuffer = function (pBuffer) {
    A_TR_NOTIFY('isRenderbuffer ( ' + pBuffer + ' )');
    return this.pContext.isRenderbuffer(pBuffer);
};

A_3DContextTracer.prototype.renderbufferStorage = function (eTarget, eInternalformat, iWidth, iHeight) {
    A_TR_NOTIFY('renderbufferStorage ( ' + A_TR_CONST(eTarget) + ', ' +  A_TR_CONST(eInternalformat) + ', ' +
        iWidth + ', ' + iHeight + ' )');
    return this.pContext.renderbufferStorage(eTarget, eInternalformat, iWidth, iHeight);
};


A_3DContextTracer.prototype.bindTexture = function (eTarget, pTexture) {
    A_TR_NOTIFY('bindTexture ( ' + A_TR_CONST(eTarget) + ', ' + pTexture + ' )');
    return this.pContext.bindTexture(eTarget, pTexture);
};

A_3DContextTracer.prototype.compressedTexImage2D = function (eTarget, iLevel, eInternalformat, iWidth, iHeight, iBorder, pPixels) {
    A_TR_NOTIFY('compressedTexImage2D ( ' + A_TR_CONST(eTarget) + ', ' + iLevel + ', ' + A_TR_CONST(eInternalformat) +
        ', ' + iWidth + ', ' + iHeight + ', ' + iBorder + ', ' +  pPixels + ' )');
    return this.pContext.compressedTexImage2D(eTarget, iLevel, eInternalformat, iWidth, iHeight, iBorder, pPixels);
};

A_3DContextTracer.prototype.compressedTexSubImage2D = function (eTarget, iLevel, iXoffset, iYoffset, iWidth, iHeight, eFormat, pPixels) {
    A_TR_NOTIFY('compressedTexSubImage2D ( ' + A_TR_CONST(eTarget) + ', ' + iLevel + ', ' + iXoffset +
        ', ' + iYoffset + ', ' + iWidth + ', ' + iHeight + ', ' + A_TR_CONST(eFormat) + ', ' +  pPixels + ' )');
    return this.pContext.compressedTexSubImage2D(eTarget, iLevel, iXoffset, iYoffset, iWidth, iHeight, eFormat, pPixels);
};

A_3DContextTracer.prototype.copyTexImage2D = function (eTarget, iLevel, eInternalformat, iX, iY, iWidth, iHeight, iBorder) {
    A_TR_NOTIFY('copyTexImage2D ( ' + A_TR_CONST(eTarget) + ', ' + iLevel + ', ' + A_TR_CONST(eInternalformat) +
        ', ' + iX + ', ' + iY + ', ' + iWidth + ', ' + iHeight + ', ' + iBorder + ' )');
    return this.pContext.copyTexImage2D(eTarget, iLevel, eInternalformat, iX, iY, iWidth, iHeight, iBorder);
};

A_3DContextTracer.prototype.copyTexSubImage2D = function (eTarget, iLevel, iXoffset, iYoffset, iX, iY, iWidth, iHeight) {
    A_TR_NOTIFY('copyTexSubImage2D ( ' + A_TR_CONST(eTarget) + ', ' + iLevel + ', ' + iXoffset + ', ' + iYoffset +
        ', ' + iX + ', ' + iY + ', ' + iWidth + ', ' + iHeight + ' )');
    return this.pContext.copyTexSubImage2D(eTarget, iLevel, iXoffset, iYoffset, iX, iY, iWidth, iHeight);
};

A_3DContextTracer.prototype.createTexture = function () {
    A_TR_NOTIFY('createTexture (  )');
    return this.pContext.createTexture();
};

A_3DContextTracer.prototype.deleteTexture = function (pTexture) {
    A_TR_NOTIFY('deleteTexture ( ' + A_HL_IF_ZR(pTexture) + ' )');
    return this.pContext.deleteTexture(pTexture);
};

A_3DContextTracer.prototype.generateMipmap = function (eTarget) {
    A_TR_NOTIFY('generateMipmap ( ' + A_TR_CONST(eTarget) + ' )');
    return this.pContext.generateMipmap(eTarget);
};

A_3DContextTracer.prototype.getTexParameter = function (eTarget, ePname) {
    A_TR_NOTIFY('getTexParameter ( ' + A_TR_CONST(eTarget) + ', ' + A_TR_CONST(ePname) + ' )');
    return this.pContext.getTexParameter(eTarget, ePname);
};

A_3DContextTracer.prototype.texImage2D = function () {
    if (arguments.length === 6) {
        A_TR_NOTIFY('texImage2D ( ' + A_TR_CONST(arguments[0]) + ', ' + arguments[1] + ', ' +
            A_TR_CONST(arguments[2]) + ', ' + A_TR_CONST(arguments[3]) + ', ' + A_TR_CONST(arguments[4]) + ', ' +
            arguments[5] + ' )');
        return this.pContext.texImage2D(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
    }
    A_TR_NOTIFY('texImage2D ( ' + A_TR_CONST(arguments[0]) + ', ' + arguments[1] + ', ' +
        A_TR_CONST(arguments[2]) + ', ' + (arguments[3]) + ', ' + (arguments[4]) + ', ' +
        arguments[5] + ', ' + A_TR_CONST(arguments[6]) + ', ' +  A_TR_CONST(arguments[7]) + ', ' + arguments[8] + ' )');
    return this.pContext.texImage2D(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
};

A_3DContextTracer.prototype.texParameterf = function (eTarget, ePname, fParam) {
    A_TR_NOTIFY('texParameterf ( ' + A_TR_CONST(eTarget) + ', ' + A_TR_CONST(ePname) + ', ' + fParam + ' )');
    return this.pContext.texParameterf(eTarget, ePname, fParam);
};

A_3DContextTracer.prototype.texParameteri = function (eTarget, ePname, iParam) {
    A_TR_NOTIFY('texParameteri ( ' + A_TR_CONST(eTarget) + ', ' + A_TR_CONST(ePname) + ', ' + A_TR_CONST(iParam) + ' )');
    return this.pContext.texParameteri(eTarget, ePname, iParam);
};

A_3DContextTracer.prototype.texSubImage2D = function (eTarget, iLevel, iXoffset, iYoffset, iWidth, iHeight, eFormat, eType, pPixels) {
    if (arguments.length === 9) {
        A_TR_NOTIFY('texSubImage2D ( ' + A_TR_CONST(eTarget) + ', ' + iLevel + ', ' +
            iXoffset + ', ' + iYoffset + ', ' + iWidth + ', ' + iHeight + ', ' + A_TR_CONST(eFormat) + ', ' + A_TR_CONST(eType) + pPixels + ' )');
        return this.pContext.texSubImage2D(eTarget, iLevel, iXoffset, iYoffset, iWidth, iHeight, eFormat, eType, pPixels);
    }
    A_TR_NOTIFY('texSubImage2D ( ' + A_TR_CONST(eTarget) + ', ' + iLevel + ', ' +
        iXoffset + ', ' + iYoffset + ', ' + ', ' + A_TR_CONST(eFormat) + ', ' + A_TR_CONST(eType) + arguments[6] + ' )');
    return this.pContext.texSubImage2D(eTarget, iLevel, iXoffset, iYoffset, eFormat, eType, arguments[6]);
};


//Programs and Shaders

A_3DContextTracer.prototype.attachShader = function (pProgram, pShader) {
    A_TR_NOTIFY('attachShader ( ' + pProgram + ', ' + pShader + ' )');
    return this.pContext.attachShader(pProgram, pShader);
};

A_3DContextTracer.prototype.bindAttribLocation = function (pProgram, iIndex, sName) {
    A_TR_NOTIFY('bindAttribLocation ( ' + pProgram + ', ' + iIndex + ', ' + sName + ' )');
    return this.pContext.bindAttribLocation(pProgram, iIndex, sName);
};

A_3DContextTracer.prototype.compileShader = function (pShader) {
    var t = this.pContext.compileShader(pShader);
    A_TR_NOTIFY('compileShader ( ' + pShader + ' )');
    return t;
};

A_3DContextTracer.prototype.createProgram = function () {
    A_TR_NOTIFY('createProgram (  )');
    return this.pContext.createProgram();
};

A_3DContextTracer.prototype.createShader = function (eType) {
    A_TR_NOTIFY('createShader ( ' + A_TR_CONST(eType) + ' )');
    return this.pContext.createShader(eType);
};

A_3DContextTracer.prototype.deleteProgram = function (pProgram) {
    A_TR_NOTIFY('deleteProgram ( ' + (pProgram) + ' )');
    return this.pContext.deleteProgram(pProgram);
};

A_3DContextTracer.prototype.deleteShader = function (pShader) {
    A_TR_NOTIFY('deleteShader ( ' + (pShader) + ' )');
    return this.pContext.deleteShader(pShader);
};

A_3DContextTracer.prototype.detachShader = function (pProgram, pShader) {
    A_TR_NOTIFY('detachShader ( ' + (pProgram) + ', ' + pShader + ' )');
    return this.pContext.detachShader(pProgram, pShader);
};

A_3DContextTracer.prototype.getAttachedShaders = function (pProgram) {
    A_TR_NOTIFY('getAttachedShaders ( ' + (pProgram) + ' )');
    return this.pContext.getAttachedShaders(pProgram);
};

A_3DContextTracer.prototype.getProgramParameter = function (pProgram, ePname) {
    var t = this.pContext.getProgramParameter(pProgram, ePname);
    A_TR_NOTIFY('getProgramParameter ( ' + pProgram + ', ' +  A_TR_CONST(ePname) + ' ) : ' + A_HL_RESULT(t));
    return t;
};

A_3DContextTracer.prototype.getProgramInfoLog = function (pProgram) {
    var t =  this.pContext.getProgramInfoLog(pProgram);
    A_TR_NOTIFY('getProgramInfoLog ( ' + pProgram + ' ) : ' + A_HL_RESULT(t));
    return t;
};

A_3DContextTracer.prototype.getShaderParameter = function (pShader, ePname) {
    var t = this.pContext.getShaderParameter(pShader, ePname);
    A_TR_NOTIFY('getShaderParameter ( ' + pShader + ', ' + A_TR_CONST(ePname) + ' ) : ' + A_HL_RESULT(t));

    return t;
};

A_3DContextTracer.prototype.getShaderPrecisionFormat = function (eType, ePrecType) {
    A_TR_NOTIFY('getShaderPrecisionFormat ( ' + A_TR_CONST(eType) + ', ' + A_TR_CONST(ePrecType) + ' )');
    return this.pContext.getShaderPrecisionFormat(eType, ePrecType);
};

A_3DContextTracer.prototype.getShaderInfoLog = function (pShader) {
    var t = this.pContext.getShaderInfoLog(pShader);
    A_TR_NOTIFY('getShaderInfoLog ( ' + pShader + ' ) : ' + A_HL_RESULT(t));
    return t;
};

A_3DContextTracer.prototype.getShaderSource = function (pShader) {
    A_TR_NOTIFY('getShaderSource ( ' + pShader + ' )');
    return this.pContext.getShaderSource(pShader);
};

A_3DContextTracer.prototype.isShader = function (pShader) {
    A_TR_NOTIFY('isShader ( ' + pShader + ' )');
    return this.pContext.isShader(pShader);
};

A_3DContextTracer.prototype.linkProgram = function (pProgram) {
    A_TR_NOTIFY('linkProgram ( ' + pProgram + ' )');
    return this.pContext.linkProgram(pProgram);
};

A_3DContextTracer.prototype.shaderSource = function (pShader, sSource) {
    A_TR_NOTIFY('shaderSource ( ' + pShader + ', ' + A_CLICKVIEW('[view source]', sSource) + ' )');
    return this.pContext.shaderSource(pShader, sSource);
};

A_3DContextTracer.prototype.useProgram = function (pProgram) {
    A_TR_NOTIFY('useProgram ( ' + pProgram + ' )');
    return this.pContext.useProgram(pProgram);
};

A_3DContextTracer.prototype.validateProgram = function (pProgram) {
    A_TR_NOTIFY('validateProgram ( ' + pProgram + ' )');
    return this.pContext.validateProgram(pProgram);
};

// Uniforms and attributes

A_3DContextTracer.prototype.disableVertexAttribArray = function (iIndex) {
    A_TR_NOTIFY('disableVertexAttribArray ( ' + iIndex + ' )');
    return this.pContext.disableVertexAttribArray(iIndex);
};

A_3DContextTracer.prototype.enableVertexAttribArray = function (iIndex) {
    A_TR_NOTIFY('enableVertexAttribArray ( ' + iIndex + ' )');
    return this.pContext.enableVertexAttribArray(iIndex);
};

A_3DContextTracer.prototype.getActiveAttrib = function (pProgram, iIndex) {
    A_TR_NOTIFY('getActiveAttrib ( ' + pProgram + ', ' +  iIndex + ' )');
    return this.pContext.getActiveAttrib(pProgram, iIndex);
};

A_3DContextTracer.prototype.getActiveUniform = function (pProgram, iIndex) {
    var t =  this.pContext.getActiveUniform(pProgram, iIndex);
    A_TR_NOTIFY('getActiveUniform ( ' + pProgram + ', ' +  iIndex + ' ) : ' +
        A_HL_RESULT('{name: ' + A_HL_STR(t.name) + ', size: ' + t.size + ', type: ' + A_TR_CONST(t.type) + '}'));
    return t;
};

A_3DContextTracer.prototype.getAttribLocation = function (pProgram, sName) {
    A_TR_NOTIFY('getAttribLocation ( ' + pProgram + ', ' +  A_HL_STR(sName) + ' )');
    return this.pContext.getAttribLocation(pProgram, sName);
};

A_3DContextTracer.prototype.getUniform = function (pProgram, pLocation) {
    A_TR_NOTIFY('getUniform ( ' + pProgram + ', ' +  pLocation + ' )');
    return this.pContext.getUniform(pProgram, pLocation);
};

A_3DContextTracer.prototype.getUniformLocation = function (pProgram, sName) {
    var t = this.pContext.getUniformLocation(pProgram, sName);
    t.name = sName;
    A_TR_NOTIFY('getUniformLocation ( ' + pProgram + ', ' +  A_HL_STR(sName) + ' ) : ' +  A_HL_RESULT(A_HL_IF_ZR(t)));
    return t;
};

A_3DContextTracer.prototype.getVertexAttrib = function (iIndex, ePname) {
    A_TR_NOTIFY('getVertexAttrib ( ' + iIndex + ', ' +  A_TR_CONST(ePname) + ' )');
    return this.pContext.getVertexAttrib(iIndex, ePname);
};

A_3DContextTracer.prototype.getVertexAttribOffset = function (iIndex, ePname) {
    A_TR_NOTIFY('getVertexAttribOffset ( ' + iIndex + ', ' +  A_TR_CONST(ePname) + ' )');
    return this.pContext.getVertexAttribOffset(iIndex, ePname);
};

A_3DContextTracer.prototype.vertexAttribPointer = function (iIndex, iSize, eType, bNorm, iStride, iOffset) {
    A_TR_NOTIFY('vertexAttribPointer ( ' + iIndex + ', ' +  iSize + ', ' +  A_TR_CONST(eType) + ', ' +
        bNorm + ', ' + iStride + ', ' + iOffset + ' )');
    return this.pContext.vertexAttribPointer(iIndex, iSize, eType, bNorm, iStride, iOffset);
};


A_3DContextTracer.prototype.uniform1f = function (pLocation, fX) {
    var t = this.pContext.uniform1f(pLocation, fX);
    A_TR_NOTIFY('uniform1f ( ' + A_HL_IF_ZR(pLocation) + ', ' +  fX + ' )');
    return t;
};

A_3DContextTracer.prototype.uniform1fv = function (pLocation, pV) {
    A_TR_NOTIFY('uniform1fv ( ' + A_HL_IF_ZR(pLocation) + ', ' +  pV + ' )');
    return this.pContext.uniform1fv(pLocation, pV);
};

A_3DContextTracer.prototype.uniform1i = function (pLocation, iX) {
    var t = this.pContext.uniform1i(pLocation, iX);
    A_TR_NOTIFY('uniform1i ( ' + A_HL_IF_ZR(pLocation) + ', ' +  iX + ' )');
    return t;
};

A_3DContextTracer.prototype.uniform1iv = function (pLocation, pV) {
    A_TR_NOTIFY('uniform1iv ( ' + A_HL_IF_ZR(pLocation) + ', ' +  pV + ' )');
    return this.pContext.uniform1iv(pLocation, pV);
};

A_3DContextTracer.prototype.uniform2f = function (pLocation, fX, fY) {
    var t = this.pContext.uniform2f(pLocation, fX, fY);
    A_TR_NOTIFY('uniform2f ( ' + A_HL_IF_ZR(pLocation) + ', ' +  fX + ', ' + fY + ' )');
    return t;
};

A_3DContextTracer.prototype.uniform2fv = function (pLocation, pV) {
    A_TR_NOTIFY('uniform2fv ( ' + A_HL_IF_ZR(pLocation) + ', ' +  pV + ' )');
    return this.pContext.uniform2fv(pLocation, pV);
};

A_3DContextTracer.prototype.uniform2i = function (pLocation, iX, iY) {
    A_TR_NOTIFY('uniform2i ( ' + A_HL_IF_ZR(pLocation) + ', ' +  iX + ', ' + iY + ' )');
    return this.pContext.uniform2i(pLocation, iX, iY);
};

A_3DContextTracer.prototype.uniform2iv = function (pLocation, pV) {
    A_TR_NOTIFY('uniform2iv ( ' + A_HL_IF_ZR(pLocation) + ', ' +  pV + ' )');
    return this.pContext.uniform2iv(pLocation, pV);
};

A_3DContextTracer.prototype.uniform3f = function (pLocation, x, y, z) {
    A_TR_NOTIFY('uniform3f ( ' + A_HL_IF_ZR(pLocation) + ', ' +  x + ', ' + y + ', ' + z + ' )');
    return this.pContext.uniform3f(pLocation, x, y, z);
};

A_3DContextTracer.prototype.uniform3fv = function (pLocation, pV) {
    A_TR_NOTIFY('uniform3fv ( ' + A_HL_IF_ZR(pLocation) + ', ' +  pV + ' )');
    return this.pContext.uniform3fv(pLocation, pV);
};

A_3DContextTracer.prototype.uniform3i = function (pLocation, x, y, z) {
    A_TR_NOTIFY('uniform3i ( ' + A_HL_IF_ZR(pLocation) + ', ' +  x + ', ' + y + ', ' + z + ' )');
    return this.pContext.uniform3i(pLocation, x, y, z);
};

A_3DContextTracer.prototype.uniform3iv = function (pLocation, pV) {
    A_TR_NOTIFY('uniform3iv ( ' + A_HL_IF_ZR(pLocation) + ', ' +  pV + ' )');
    return this.pContext.uniform3iv(pLocation, pV);
};

//--

A_3DContextTracer.prototype.uniform4f = function (pLocation, x, y, z, w) {
    A_TR_NOTIFY('uniform4f ( ' + A_HL_IF_ZR(pLocation) + ', ' +  x + ', ' + y + ', ' + z + ', ' + w + ' )');
    return this.pContext.uniform4f(pLocation, x, y, z, w);
};

A_3DContextTracer.prototype.uniform4fv = function (pLocation, pV) {
    A_TR_NOTIFY('uniform4fv ( ' + A_HL_IF_ZR(pLocation) + ', ' +  pV + ' )');
    return this.pContext.uniform4fv(pLocation, pV);
};

A_3DContextTracer.prototype.uniform4i = function (pLocation, x, y, z, w) {
    A_TR_NOTIFY('uniform4i ( ' + A_HL_IF_ZR(pLocation) + ', ' +  x + ', ' + y + ', ' + z + ', ' + w + ' )');
    return this.pContext.uniform4i(pLocation, x, y, z, w);
};

A_3DContextTracer.prototype.uniform4iv = function (pLocation, pV) {
    A_TR_NOTIFY('uniform4iv ( ' + A_HL_IF_ZR(pLocation) + ', ' +  pV + ' )');
    return this.pContext.uniform4iv(pLocation, pV);
};

A_3DContextTracer.prototype.uniformMatrix2fv = function (pLocation, bTranspose, pV) {
    A_TR_NOTIFY('uniformMatrix2fv ( ' + A_HL_IF_ZR(pLocation) + ', ' +  bTranspose + ', ' + pV + ' )');
    return this.pContext.uniformMatrix2fv(pLocation, bTranspose, pV);
};

A_3DContextTracer.prototype.uniformMatrix3fv = function (pLocation, bTranspose, pV) {
    A_TR_NOTIFY('uniformMatrix3fv ( ' + A_HL_IF_ZR(pLocation) + ', ' +  bTranspose + ', ' + pV + ' )');
    return this.pContext.uniformMatrix3fv(pLocation, bTranspose, pV);
};

A_3DContextTracer.prototype.uniformMatrix4fv = function (pLocation, bTranspose, pV) {
    A_TR_NOTIFY('uniformMatrix4fv ( ' + A_HL_IF_ZR(pLocation) + ', ' +  bTranspose + ', ' + pV + ' )');
    return this.pContext.uniformMatrix4fv(pLocation, bTranspose, pV);
};


// Writing to the drawing buffer


A_3DContextTracer.prototype.clear = function (iMask) {
    A_TR_NOTIFY('clear ( ' + iMask + ' )');
    return this.pContext.clear(iMask);
};

A_3DContextTracer.prototype.drawArrays = function (eMode, iFirst, iCount) {
    var pType = ['POINTS', 'LINES', 'LINE_LOOP', 'LINE_STRIP', 'TRIANGLES', 'TRIANGLE_STRIP', 'TRIANGLE_FAN'];
    A_TR_NOTIFY(A_HL_DRAW_CALL('drawArrays ( ' + A_HL_IF_UNDEF(pType[eMode]) + ', ' +  iFirst + ', ' + iCount + ' )'));
    return this.pContext.drawArrays(eMode, iFirst, iCount);
};

A_3DContextTracer.prototype.drawElements = function (eMode, iCount, eType, iOffset) {
    A_TR_NOTIFY(A_HL_DRAW_CALL('drawElements ( ' + A_TR_CONST(eMode) + ', ' +  iCount + ', ' + A_TR_CONST(eType) + ', ' + iOffset + ' )'));
    return this.pContext.drawElements(eMode, iCount, eType, iOffset);
};

A_3DContextTracer.prototype.finish = function () {
    A_TR_NOTIFY('finish (  )');
    return this.pContext.finish();
};

A_3DContextTracer.prototype.flush = function () {
    A_TR_NOTIFY('flush (  )');
    return this.pContext.flush();
};


//read
A_3DContextTracer.prototype.readPixels = function (iX, iY, iWidth, iHeight, eFormat, eType, pPixels) {
    A_TR_NOTIFY('readPixels ( ' + iX + ', ' + iY + ', ' + iWidth + ', ' + iHeight + ', ' + A_TR_CONST(eFormat) + ', ' + A_TR_CONST(eType) + ', ' + pPixels + ' )');
    return this.pContext.readPixels(iX, iY, iWidth, iHeight, eFormat, eType, pPixels);
};


//vertex attrib

A_3DContextTracer.prototype.vertexAttrib1f = function (iIndex, fX) {
    A_TR_NOTIFY('vertexAttrib1f ( ' + A_HL_IF_LZ(iIndex) + ', ' + fX + ' )');
    return this.pContext.vertexAttrib1f(iIndex, fX);
};

A_3DContextTracer.prototype.vertexAttrib1fv = function (iIndex, pV) {
    A_TR_NOTIFY('vertexAttrib1fv ( ' + A_HL_IF_LZ(iIndex) + ', ' + pV + ' )');
    return this.pContext.vertexAttrib1fv(iIndex, pV);
};

A_3DContextTracer.prototype.vertexAttrib2f = function (iIndex, fX, fY) {
    A_TR_NOTIFY('vertexAttrib2f ( ' + A_HL_IF_LZ(iIndex) + ', ' + fX + ', ' + fY + ' )');
    return this.pContext.vertexAttrib2f(iIndex, fX, fY);
};

A_3DContextTracer.prototype.vertexAttrib2fv = function (iIndex, pV) {
    A_TR_NOTIFY('vertexAttrib2fv ( ' + A_HL_IF_LZ(iIndex) + ', ' + pV + ' )');
    return this.pContext.vertexAttrib2fv(iIndex, pV);
};

A_3DContextTracer.prototype.vertexAttrib3f = function (iIndex, fX, fY, fZ) {
    A_TR_NOTIFY('vertexAttrib3f ( ' + A_HL_IF_LZ(iIndex) + ', ' + fX + ', ' + fY + ', ' + fZ + ' )');
    return this.pContext.vertexAttrib3f(iIndex, fX, fY, fZ);
};

A_3DContextTracer.prototype.vertexAttrib3fv = function (iIndex, pV) {
    A_TR_NOTIFY('vertexAttrib3fv ( ' + A_HL_IF_LZ(iIndex) + ', ' + pV + ' )');
    return this.pContext.vertexAttrib3fv(iIndex, pV);
};

A_3DContextTracer.prototype.vertexAttrib4f = function (iIndex, fX, fY, fZ, fW) {
    A_TR_NOTIFY('vertexAttrib4f ( ' + A_HL_IF_LZ(iIndex) + ', ' + fX + ', ' + fY + ', ' + fZ + ', ' + fW + ' )');
    return this.pContext.vertexAttrib4f(iIndex, fX, fY, fZ, fW);
};

A_3DContextTracer.prototype.vertexAttrib4fv = function (iIndex, pV) {
    A_TR_NOTIFY('vertexAttrib4fv ( ' + A_HL_IF_LZ(iIndex) + ', ' + pV + ' )');
    return this.pContext.vertexAttrib4fv(iIndex, pV);
};
