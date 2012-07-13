
function TestUnique (sHash) {
    'use strict';
	
	A_CLASS;

	this.pData = new Array(500);
}

function TestUnique2 (pHash) {
    'use strict';

    this.pData = new Array(500);
}

EXTENDS(TestUnique, a.Unique);

TestUnique.prototype.computeHash = function (pArgv) {
    'use strict';
    
    return pArgv[0];
};

function MyGame() {
	A_CLASS;
};

EXTENDS(MyGame, a.Engine);

MyGame.prototype.oneTimeSceneInit = function () {
	'use strict';
	
	this.notifyOneTimeSceneInit();
	this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0.0, 500.0));

	var iBegin;

	// var T = function (i) {this.i = new Array(i);};
	// var P = function (i) {return new T(i)}
	// iBegin = a.now();
	
	// for (var i = 0; i < 10000000; i++) {
	// 	new T(i);
	// }
	
	// trace(a.now() - iBegin, 'ms');

	// iBegin = a.now();

	// for (var i = 0; i < 10000000; i++) {
	// 	new P(i);
	// }

	// trace(a.now() - iBegin, 'ms');

	var n = 1000;
	var pHash = ['0', '1', '2', '3', '4', '5'];
	
	iBegin = a.now();
	
	for (var i = 0; i < n; i++) {
		new TestUnique2(pHash[i % 5]);	
	}

	trace(a.now() - iBegin, 'ms');


	iBegin = a.now();

	for (var i = 0; i < n; i++) {
		new TestUnique(pHash[i % 5]);			
	}

	trace(a.now() - iBegin, 'ms');

	// trace(new TestUnique(new TestHash('Moscow')));
	// trace(new TestUnique(new TestHash('NewYork')));
	// trace(new TestUnique(new TestHash('Milan')));
	// trace(new TestUnique(new TestHash('Moscow')));
	// trace(new TestUnique(new TestHash('Milan')));
	// trace(new TestUnique(new TestHash('Moscow')));

	// var pUniqPool = [];
	// for (var i = 0; i < 4; ++ i) {
	// 	pUniqPool.push(new TestUnique);
	// }

	// trace(pUniqPool);

	return true;
}; 

MyGame.prototype.restoreDeviceObjects = function () {
	this.notifyRestoreDeviceObjects();
	return true;
};


MyGame.prototype.initDeviceObjects = function () {
	this.notifyInitDeviceObjects();
	
	return true;
};

MyGame.prototype.deleteDeviceObjects = function () {
	this.notifyDeleteDeviceObjects();
	return true;
};

MyGame.prototype.updateScene = function () {
	this.updateCamera(1.0, 0.1, null, 30.0, false);
	return this.notifyUpdateScene();
};

if (!a.info.support.webgl) {
	alert('Error:: Your browser does not support WebGL.');
}
else {
	var App = new MyGame();
	if (!App.create('canvas') || !App.run()) {
		alert('something wrong....');
	}
}