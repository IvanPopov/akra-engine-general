Ifdef(__AKRA_ENGINE__);

Define (__ANALYZER, true);

Define (A_TIMESTAMP(), function () {
    (new Date()).getTime();
});

Define (A_TRACER.MESG(message), function () {
    window['A_TRACER.trace'](message);
});

Define(A_TRACER.BEGIN(), function() {
    window['A_TRACER.beginTracing']();
});
Define(A_TRACER.END(), function() {
    window['A_TRACER.endTracing']();
});

Define(A_HL_MESSAGE(value), function () {
    '<span style="background-color: gray;">' + value.toString() + '</span>';
});

Define(A_HL_WARN(value), function () {
    '<span style="background-color: orange; padding: 5px; border-radius: 5px; border: 1px solid red;">' + value + '</span>';
});

//
Define(A_HL_RESULT(value), function () {
    '<span style="background-color: #f5f5f5; border-radius: 5px;padding: 5px;border: 1px solid #adff2f;">' + value + '</span>';
});

Define(A_HL_SUCCESS(value), function () {
    '<span style="background-color: #adff2f;">' + value + '</span>';
});

Define(A_HL_GRAPHIC_CALL(value), function () {
    '<pre style="display: inline-block; font-family: monospace;">' + value.toString() + '</pre>';
});

Define(A_HL_TIMESTAMP(value), function () {
    '<small style="color: #CCC;">' + value + '</small>';
});
Define(A_HL_UNKNOWN(value), function () {
    '<span style="background-color: #ffd500; border-radius: 5px; border: 1px solid red;">' + value + '</span>';
});
///
Define (A_HL_IF_ZR(value), function () {
    (value? A_HL_SUCCESS(value): A_HL_WARN(value))
});
//A_HL_IF_LZ(iIndex)
Define (A_HL_IF_LZ(value), function () {
    (value !== -1? A_HL_SUCCESS(value): A_HL_WARN(value))
});
Define (A_HL_IF_UNDEF(value), function () {
    (value !== undefined? A_HL_SUCCESS(value): A_HL_WARN(value))
});
//
Define (A_HL_DRAW_CALL(value), function () {
    '<span style="border-bottom: 1px dotted gray; padding: 5px; border-radius: 5px; background-color: yellow;">"' + value + '"</span>';
});
Define (A_HL_STR(value), function () {
    '<span style="background-color: #f5f5dc;">"' + value + '"</span>';
});

Define(A_HL_INVALID_CALL(value), function () {
    '<small style="margin: 5px; display: block; box-shadow: 3px 3px 5px #888; padding: 10px; font-weight: bold; background-color: #ffcaca; border: 1px solid red; border-radius: 4px;">' + value + '</small>';
});




Include('A_Event.js');
Include('A_Timeline.js');
Include('A_3DContextTracer.js');

function A_Analyzer () {

    Define(A_CRICIAL(__ARGS__), function () { this.critical(__ARGS__); })

    if (statics.singleton) {
        A_CRICIAL('Akra analyzer already created.');
        return;
    }

    this.singleton();

    this.pTimeline = new A_Timeline();
    this.pContext = null;
    this.pContextTracer = new A_3DContextTracer(this.pTimeline);


    if (window['akra']) {
        this.grab(window['akra']);
    }
}

STATIC(A_Analyzer, singleton, 0);

A_Analyzer.prototype.critical = function (sMesg) {
    throw new Error(sMesg);
};

A_Analyzer.prototype.grab = function (a) {
    var fnCreateDevice = a.createDevice;
    var pRealContext = null;
    var pContextTracer = this.pContextTracer;

    a.createDevice = function (pCanvas) {
        pRealContext = fnCreateDevice(pCanvas);
        pContextTracer.setRenderState = pRealContext.setRenderState;
        pContextTracer.proxy(pRealContext);
        return pContextTracer;
    };

    this.pContext = pRealContext;

    this.grabEngine(a.Engine);
};

A_Analyzer.prototype.grabEngine = function (pEngine) {
    var pTimeline = this.pTimeline;
    var fnRender3DEnvironment,
        fnCreate

    pTimeline.begin();

    fnRender3DEnvironment = pEngine.prototype.render3DEnvironment;
    pEngine.prototype.render3DEnvironment = function () {
        pTimeline.frame();
        return fnRender3DEnvironment.apply(this, arguments);
    };

    fnCreate = pEngine.prototype.create;

    pEngine.prototype.create = function () {
        if (fnCreate.apply(this, arguments)) {
            //replace context;
            return true;
        }

        A_CRITICAL('Cannot grab 3d context.');
        return false;
    };

    window['A_TRACER.beginTracing'] = function () {
        pTimeline.writing(true);
    };
    window['A_TRACER.endTracing'] = function () {
        pTimeline.writing(false);
        pTimeline.dump();
    };

    window['A_TRACER.trace'] = function (sMessage) {
        pTimeline.message(sMessage);
    };
};

A_Analyzer.prototype.singleton = function () {
    statics.singleton = true;
};

new A_Analyzer();

Endif();
