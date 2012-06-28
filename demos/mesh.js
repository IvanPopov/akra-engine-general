function MyGame() {
	A_CLASS;
};

EXTENDS(MyGame, a.Engine);

MyGame.prototype.oneTimeSceneInit = function () {
	'use strict';
	
	this.notifyOneTimeSceneInit();
	this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0.0, 500.0));



	return true;
}; 

MyGame.prototype.restoreDeviceObjects = function () {
	this.notifyRestoreDeviceObjects();
	return true;
};


MyGame.prototype.initDeviceObjects = function () {
	this.notifyInitDeviceObjects();
	
	trace(buildCubeMesh(this, 0));

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