
function A_Timeline () {
    Define(A_TL_BUFFER_SIZE, 2048);
    Define(A_TL_CHECK_STATE(), function () {if (!this._isActive) return;});
    this.iStartTime = A_TIMESTAMP();
    this._nTotalFrames = 0;
    this._nEvents = 0;
    this._pEvents = [];
    this._isActive = false;
    this.extend();
}
A_Timeline.prototype.begin = function () {
    this.message('Begin the analysis.');
};

A_Timeline.prototype.writing = function (bState) {
    this._isActive = bState;
};

A_Timeline.prototype.totalFrames = function () {
    return this._nTotalFrames;
};

A_Timeline.prototype.message = function (sMesg) {
    A_TL_CHECK_STATE();
    this._pEvents[this._nEvents].message(A_HL_MESSAGE(sMesg));
    this.update();
};


A_Timeline.prototype.frame = function () {
    A_TL_CHECK_STATE();
    this._pEvents[this._nEvents].frame(++ this._nTotalFrames);
    this.update();
};

A_Timeline.prototype.extend = function () {
    for (var i = 0; i < A_TL_BUFFER_SIZE; i++) {
        this._pEvents.push(new A_Event());
    }
};

A_Timeline.prototype.dump = function () {
    for (var i = 0; i < this._nEvents; i++) {
        var pEvent = this._pEvents[i];
        var pWin = new a.DebugWindow('Akra analyzer dump.');
        pWin.print(pEvent.dump(this.iStartTime));
    }
};

A_Timeline.prototype.graphicCall = function (sCall) {
    A_TL_CHECK_STATE();
    this._pEvents[this._nEvents].graphicCall(sCall);
    this.update();
};

A_Timeline.prototype.error = function (sCall) {
    A_TL_CHECK_STATE();
    this._pEvents[this._nEvents].error(sCall);
    this.update();
};

A_Timeline.prototype.invalidCall = function (sCall) {
    A_TL_CHECK_STATE();
    this._pEvents[this._nEvents].invalidCall(sCall);
    this.update();
};

A_Timeline.prototype.update = function () {
    A_TL_CHECK_STATE();
    this._pEvents[this._nEvents ++].setup(new Error());

    if (this._nEvents === A_TL_BUFFER_SIZE) {
        this.extend();
    }
};
