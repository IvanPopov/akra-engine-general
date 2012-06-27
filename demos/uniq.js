function TestHash(sData) {
	'use strict';
	
	A_CLASS;
	//this.setOption(a.StringHash.ALGORITHM_MD5, true);
	this.setup(sData);
} 

EXTENDS(TestHash, a.StringHash);

TestHash.prototype.setup = function(sData) {
	'use strict';
	
	return parent.setup(sData);
};


function TestUnique (pHash) {
    'use strict';

	A_CLASS;
	
	this.pArray = new Array(100);
	for (var i = 0; i < 5; i++) {
		this.nSize = (100 + ((Math.random() * 100) >>> 1));
		this.pArray[i] = (new Array(this.nSize));
	};
}

function TestUnique2 (pHash) {
    'use strict';

    this.pArray = new Array(100);
	for (var i = 0; i < 5; i++) {
		this.nSize = (100 + ((Math.random() * 100) >>> 1));
		this.pArray[i] = (new Array(this.nSize));
	};
}

// TestUnique.createUnique = function (sData) {
//     'use strict';

// 	var pObject = new TestUnique(sData);
// 	pObject.hack = 'I\'s IMBA :)';

// 	return pObject;
// }

EXTENDS(TestUnique, a.Unique);

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

	var n = 100000;
	var pHash = [new TestHash('0'), new TestHash('1'), new TestHash('2'), new TestHash('3'), new TestHash('4')];
	
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