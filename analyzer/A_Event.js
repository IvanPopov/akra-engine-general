function A_Event () {

    Enum([
        A_ET_MESSAGE = 1,
        A_ET_NOTICE,
        A_ET_WARNING,
        A_ET_ERROR = 4,
        A_ET_CRITICAL,
        A_ET_FRAME = -1,
        A_ET_GRAPHIC_CALL = -2,
        A_ET_INVALID_CALL = -3
    ], A_EVENT_TYPES);

    this.iTimestamp = 0;
    this.pCallStack = null;
    this.pData = null;
    this.eType = 0;
};

A_Event.prototype.message = function (sMessage) {
    this.eType = A_ET_MESSAGE;
    this.pData = sMessage;
};

A_Event.prototype.graphicCall = function (sCall) {
    this.eType = A_ET_GRAPHIC_CALL;
    this.pData = sCall;
};

A_Event.prototype.frame = function (n) {
    this.eType = A_ET_FRAME;
    this.pData = n;
};

A_Event.prototype.invalidCall = function (sMessage) {
    this.eType = A_ET_INVALID_CALL;
    this.pData = sMessage;
};

A_Event.prototype.setup = function (pCallStack) {
    this.iTimestamp = A_TIMESTAMP();
    this.pCallStack = pCallStack;
};

A_Event.prototype.dump = function (iStartTime) {
    iStartTime = iStartTime || 0;
    var sData = '';
    switch (this.eType) {
        case A_ET_MESSAGE:
            sData = this.pData;
            break;
        case A_ET_FRAME:
            sData = 'FRAME ' + this.pData + '<hr />';
            break;
        case A_ET_GRAPHIC_CALL:
            sData = A_HL_GRAPHIC_CALL(this.pData);
            break;
        case A_ET_INVALID_CALL:
            return A_HL_INVALID_CALL(this.pData);
            break;
    }
    return A_HL_TIMESTAMP('[ ' + (this.iTimestamp - iStartTime) + ' ms ]  \t') + sData;
};