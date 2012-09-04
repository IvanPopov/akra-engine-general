function PopArray(nLength, iIncrement, eMode) {
    Enum([
             LOOP = 1,
             ADD = 2
         ], ARRAYWRITEMODE, a.SystemArray);

    this._pData = new Array(nLength || 100);
    this._nCount = 0;
    this._eMode = eMode || a.SystemArray.ADD;
    this._iIncrement = iIncrement || 10;
    this._pAllocator = null;
}
A_NAMESPACE(PopArray);

PROPERTY(PopArray, "length",
         function () {
             return this._nCount
         });

PopArray.prototype.release = function (isStrong) {
    this._nCount = 0;
    if (isStrong) {
        var pData = this._pData;
        var iLength = pData.length;
        for (var i = 0; i < iLength; i++) {
            pData[i] = null;
        }
    }
    if (this._pAllocator !== null) {
        this._pAllocator._releaseElement(this);
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

PopArray.prototype.element = function (index) {
    if (index === undefined || index >= this._nCount) {
        return null;
    }
    return this._pData[index];
};


function Map() {
    this.pKeys = new a.PopArray();
    this.pValues = new a.PopArray();
    this._pMap = {};
    this._pAllocator = null;
}
A_NAMESPACE(Map);

Map.prototype.release = function (isStrong) {
    this.pKeys.release(isStrong);
    this.pValues.release(isStrong);
    if (this._pAllocator !== null) {
        this._pAllocator._releaseElement(this);
    }
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

Map.prototype.element = function (sKey) {
    var index = this._pMap[sKey];
    return (index !== undefined && this.pKeys.element(index) === sKey) ? this.pValues[index] : null;
};

//function MapAllocator(nCount, iIncrement) {
//    this._pElements = new Array(nCount || 100);
//    this._nCount = 0;
//    this._iIncrement = iIncrement || 10;
//    for (var i = 0; i < this._pElements.length; i++) {
//        this._pElements[i] = new a.Map();
//        this._pElements[i].index = i;
//    }
//}

function Allocator(fnConstructor, nCount, iIncrement) {
    if (!fnConstructor) {
        return false;
    }
    this._pElements = new Array(nCount || 100);
    this._nCount = 0;
    this._iIncrement = iIncrement || 10;
    this._fnConstructor = fnConstructor;

    for (var i = 0; i < this._pElements.length; i++) {
        this._pElements[i] = new this._fnConstructor();
        this._pElements[i]._pAllocator = this;
    }
}

Allocator.prototype.getElement = function () {
    var pElements = this._pElements;
    if (pElements.length === this._nCount) {
        this._addElements();
    }
    return pElements[this._nCount++];
};

Allocator.prototype._addElements = function () {
    var pElements = this._pElements;
    var pElement;
    for (var i = 0; i < this._iIncrement; i++) {
        pElement = new this._fnConstructor();
        pElements.push(pElement);
        pElement._pAllocator = this;
    }
};

Allocator.prototype._releaseElement = function (pElement) {
    this._pElements[--this._nCount] = pElement;
};

a._pMapAllocator = new Allocator(a.Map, 1000, 100);
a._pArrayAllocator = new Allocator(a.PopArray, 1000, 100);

function PopArrayStorage() {
    return a._pArrayAllocator.getElement();
}

function MapStorage() {
    return a._pMapAllocator.getElement();
}

var pObj, pObj1, pObj2, pObj3, pObj4;
var pMap, pMap1, pMap2, pMap3, pMap4;
function test1() {
    pObj = new Object();
//    pObj1 = new Object();
//    pObj2 = new Object();
//    pObj3 = new Object();
//    pObj4 = new Object();
    for (var i = 0; i < 1000; i++) {
        pObj["Prop_" + i] = i * i + 1;
//        pObj1["Prope_" + i] = i * i + 1;
//        pObj2["Proper_" + i] = i * i + 1;
//        pObj3["Propert_" + i] = i * i + 1;
//        pObj4["Property_" + i] = i * i + 1;
    }
//    var pKeys = Object.keys(pObj);
//    var sKey;
//    for(var i = 0; i < pKeys.length; i++){
//        sKey = pKeys[i];
//        pObj[sKey] = pObj[sKey]*(pObj[sKey]-1);
//    }

    for (var i in pObj) {
        pObj[i] = pObj[i] * (pObj[i] - 1);
    }
}
function test2() {
    pMap = new MapStorage();
//    pMap1 = new MapStorage();
//    pMap2 = new MapStorage();
//    pMap3 = new MapStorage();
//    pMap4 = new MapStorage();
    for (var i = 0; i < 1000; i++) {
        pMap.addElement("Prop_" + i, i * i + 1);
//        pMap1.addElement("Prope_" + i, i * i + 1);
//        pMap2.addElement("Proper_" + i, i * i + 1);
//        pMap3.addElement("Propert_" + i, i * i + 1);
//        pMap4.addElement("Property_" + i, i * i + 1);
    }
    var pValues = pMap.pValues;
    var iLength = pMap.pValues.length;
    for (var i = 0; i < iLength; i++) {
        pValues._pData[i] = pValues._pData[i] * (pValues._pData[i] - 1);
    }
}

function timeWrapper(pFunc, nTimes, arg1) {
    var i, time = new Date();
    eval("for (var i = 0; i < nTimes; i++) { pFunc.call(null, arg1);}");
    return new Date() - time;
}

trace("1: ", timeWrapper(test1, 100));
trace("2: ", timeWrapper(test2, 100));

trace(a._pMapAllocator);

trace("1: ", timeWrapper(test1, 100));
trace("2: ", timeWrapper(test2, 100));


//
//function mapTest1() {
//    var obj = {};
//    for (var i = 0; i < 1000; i++) {
//        obj["Prop" + i] = i * i - 1;
//    }
//    return obj;
//}
//
//function mapTest2(myObj) {
//    myObj.release();
//    for (var i = 0; i < 1000; i++) {
//        myObj.addElement("Prop" + i, i * i - 1);
//    }
//    return myObj;
//}
//var myObj = new Map();
//myObj.create();
//
//trace("Base: ", timeWrapper(mapTest1, 1000));
//trace("My: ", timeWrapper(mapTest2, 1000, myObj));
//
//trace(myObj);
//
//trace("Base: ", timeWrapper(mapTest1, 1000));
//trace("My: ", timeWrapper(mapTest2, 1000, myObj));
//
//trace("-------------");


//function test1(arr) {
//    for (var i = 0; i < 100; i++) {
//        arr.push({});
//    }
//}
//
//function test2(arr) {
//    arr += 100;
//    for (var i = arr.length - 100; i < arr.length; i++) {
//        arr[i] = {};
//    }
//}
//
//trace("1: ", timeWrapper(test1, 1000, []));
//trace("2: ", timeWrapper(test2, 1000, []));
//
//
//trace("1: ", timeWrapper(test1, 1000, []));
//trace("2: ", timeWrapper(test2, 1000, []));


