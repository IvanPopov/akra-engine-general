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

PopArray.prototype.shift = function () {

};

PopArray.prototype.unshift = function () {

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
    this._pKeys = new a.PopArray();
    this._pValues = new a.PopArray();
    this._pMap = {};
    this._pAllocator = null;
}
A_NAMESPACE(Map);

Map.prototype.release = function (isStrong) {
    this._pKeys.release(isStrong);
    this._pValues.release(isStrong);
    if (this._pAllocator !== null) {
        this._pAllocator._releaseElement(this);
    }
};

Map.prototype.addElement = function (sKey, pValue) {
    var pKeys = this._pKeys;
    var pValues = this._pValues;
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
    return (index !== undefined && this._pKeys.element(index) === sKey);
};

Map.prototype.element = function (sKey) {
    var index = this._pMap[sKey];
    return (index !== undefined && this._pKeys.element(index) === sKey) ? this._pValues._pData[index] : null;
};


function Map2() {
    this._pKeys = new a.PopArray();
    this._pMap = {};
    this._pAllocator = null;
}
A_NAMESPACE(Map2);

PROPERTY(Map2, "length", function () {
    return this._pKeys._nCount;
});

PROPERTY(Map2, "keys", function () {
    return this._pKeys._pData;
});

Map2.prototype.release = function (isStrong) {
    var pKeys = this._pKeys;
    var iLength = pKeys._nCount;
    var pMap = this._pMap;
    for (var i = 0; i < iLength; i++) {
        pMap[pKeys[i]] = undefined;
    }
    pKeys.release(isStrong);
    if (this._pAllocator !== null) {
        this._pAllocator._releaseElement(this);
    }
};

Map2.prototype.addElement = function (sKey, pValue) {
    var pKeys = this._pKeys;
    var pMap = this._pMap;
    if (pMap[sKey] === undefined) {
        pKeys.push(sKey);
    }
    pMap[sKey] = pValue;
};

Map2.prototype.hasElement = function (sKey) {
    return !(this._pMap[sKey] === undefined);
};

Map2.prototype.element = function (sKey) {
    return this._pMap[sKey];
};

Map2.prototype.key = function (index) {
    return this._pKeys.element(index);
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

A_NAMESPACE(Allocator);

a._pMapAllocator = new Allocator(a.Map, 1000, 100);
a._pMap2Allocator = new Allocator(a.Map2, 1000, 100);
a._pArrayAllocator = new Allocator(a.PopArray, 1000, 100);

function PopArrayStorage() {
    return a._pArrayAllocator.getElement();
}

function MapStorage() {
    return a._pMapAllocator.getElement();
}

function Map2Storage() {
    return a._pMap2Allocator.getElement();
}

var pObj, pObj1, pObj2, pObj3, pObj4;
var pMap, pMap1, pMap2, pMap3, pMap4;
function test1() {
    pObj = {};
    var sName, pValue;
    for (var i = 0; i < 20; i++) {
        sName = "Prop_" + i;
        pValue = i * i + 1;
        pObj[sName] = pValue;
    }
    var pKeys = Object.keys(pObj);
    var iLength = pKeys.length;
    for (var i = 0; i < iLength; i++) {
        pObj[pKeys[i]] *= 2; // pObj[pKeys[i]] * 2;
    }
}
function test2() {
    pMap = new MapStorage();
    var sName, pValue;
    for (var i = 0; i < 20; i++) {
        sName = "Prop_" + i;
        pValue = i * i + 1;
        pMap.addElement(sName, pValue);
    }
    var iLength = pMap._pKeys._nCount;
    var pKeys = pMap._pKeys._pData;
    var pValue;
    for (var i = 0; i < iLength; i++) {
        pValue = pMap.element(pKeys[i]);
        pMap.addElement(pKeys[i], pValue * 2);
    }
    pMap.release();
}

function test3() {
    pMap2 = new Map2Storage();
    var sName, pValue;
    for (var i = 0; i < 20; i++) {
        sName = "Prop_" + i;
        pValue = i * i + 1;
        pMap2.addElement(sName, pValue);
    }
//    var iLength = pMap2.length;
//    var pKeys = pMap2.keys;
//    var pValue;
//    for (var i = 0; i < iLength; i++) {
//        pValue = pMap2.element(pKeys[i]);
//        pMap2.addElement(pKeys[i], pValue * 2);
//    }
    var iLength = pMap2.length;
    var pKeys = pMap2.keys;
    var pValue;
    for (var i = 0; i < iLength; i++) {
        pValue = pMap2.element(pKeys[i]);
        pMap2.addElement(pKeys[i], pValue * 2);
    }
    pMap2.release();
}

function timeWrapper(pFunc, nTimes, arg1) {
    var i, time = new Date();
    eval("for (var i = 0; i < nTimes; i++) { pFunc.call(null, arg1);}");
    return new Date() - time;
}

trace("1: ", timeWrapper(test1, 1000));
trace("2: ", timeWrapper(test2, 1000));
trace("3: ", timeWrapper(test3, 1000));

//trace(a._pMapAllocator);
//trace(a._pMap2Allocator);
trace("-----------------");

trace("1: ", timeWrapper(test1, 1000));
trace("2: ", timeWrapper(test2, 1000));
trace("3: ", timeWrapper(test3, 1000));


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


