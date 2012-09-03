function PopArray(nLength, iIncrement, eMode) {
    Enum([
             LOOP = 1,
             ADD = 2
         ], ARRAYWRITEMODE, a.SystemArray);

    this._pData = nLength !== undefined ? new Array(nLength) : null;
    this._nCount = 0;
    this._eMode = eMode || a.SystemArray.ADD;
    this._iIncrement = iIncrement || 0;
}
A_NAMESPACE(PopArray);

PROPERTY(PopArray, "length",
         function () {
             return this._nCount
         });

PopArray.prototype.create = function (nLength, iIncrement, eMode) {
    nLength = nLength || 100;
    iIncrement = iIncrement || 10;
    eMode = eMode || a.SystemArray.ADD;
    this._pData = new Array(nLength);
    this._eMode = eMode;
    this._nCount = 0;
};

PopArray.prototype.release = function (isStrong) {
    this._nCount = 0;
    if (isStrong) {
        var pData = this._pData;
        var iLength = pData.length;
        for (var i = 0; i < iLength; i++) {
            pData[i] = null;
        }
    }
};

PopArray.prototype._addElements = function () {
    this._pData.length += this._iIncrement;
};

PopArray.prototype.push = function (pObject) {
    if (this._pData.length === this._nCount) {
        if (this._eMode === a.SystemArray.ADD) {
            this._addElements();
        }
        else if (this._eMode === a.SystemArray.LOOP) {
            this._nCount = 0;
        }
    }
    this._pData[this._nCount++] = pObject;
};

PopArray.prototype.pop = function () {
    if (this._nCount === 0) {
        return null;
    }
    return this._pData[--this._nCount];
};

PopArray.prototype.setElement = function (index, pValue) {
    if (index >= this._nCount) {
        return false;
    }
    this._pData[index] = pValue;
};

PopArray.prototype.element = function(index){
    if (index === undefined || index >= this._nCount) {
        return null;
    }
    return this._pData[index];
};

function Map() {
    this.pKeys = new a.PopArray();
    this.pValues = new a.PopArray();
    this._pMap = null;
}
A_NAMESPACE(Map);


Map.prototype.create = function () {
    this.pKeys.create();
    this.pValues.create();
    this._pMap = {};
};

Map.prototype.release = function (isStrong) {
    this.pKeys.release(isStrong);
    this.pValues.release(isStrong);
};

Map.prototype.addElement = function (sKey, pValue) {
    var pKeys = this.pKeys;
    var pValues = this.pValues;
    var pMap = this._pMap;
    var index = pMap[sKey];
    var iSize = pKeys._nCount;
    var sOldKey;
    sOldKey = pKeys.element(index);
    if (!sOldKey || sOldKey !== sKey) {
        pKeys.push(sKey);
        pValues.push(pValue);
        pMap[sKey] = iSize;
    }
//    else if (sOldKey === sKey) {
        pValues.setElement(index, pValue);
//    }
};

Map.prototype.hasElement = function (sKey) {
    var index = this._pMap[sKey];
    return (index !== undefined && this.pKeys.element(index) === sKey);
};

Map.prototype.element = function(sKey) {
    var index = this._pMap[sKey];
    return (index !== undefined && this.pKeys.element(index) === sKey) ? this.pValues[index] : null;
};


function test1(){
    var obj = {};
    for(var i = 0; i < 1000; i++){
        obj["Prop"+i] = i*i-1;
    }
    return obj;
}

function test2(myObj){
    myObj.release();
    for(var i = 0; i < 1000; i++){
        myObj.addElement("Prop"+i, i*i-1);
    }
    return myObj;
}

function timeWrapper(pFunc, nTimes, arg1){
    var i, time = new Date();
    for(i = 0; i < nTimes; i++){
        pFunc.call(null, arg1);
    }
    return new Date() - time;
}


var myObj = new Map();
myObj.create();

trace("Base: ", timeWrapper(test1, 1000));
trace("My: ", timeWrapper(test2, 1000, myObj));

trace(myObj);

trace("Base: ", timeWrapper(test1, 1000));
trace("My: ", timeWrapper(test2, 1000, myObj));

trace("-------------");


