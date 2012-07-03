
// function UniqResource(pEngine) {
// 	A_CLASS;
// }

// EXTENDS(UniqResource, a.Unique);

// UniqResource.prototype.color = function(sColor) {
// 	A_UNIQ([sColor]);
// };



// UniqResource.uHash = function(pHashData) {
// 	var sHash = pHashData.join('::');
// 	return sHash;
// };

// A_REGISTER_UNIQ_OBJECT(UniqResource);





function MyGame() {
	A_CLASS;
};

a.extend(MyGame, a.Engine);

MyGame.prototype.oneTimeSceneInit = function () {
	this.notifyOneTimeSceneInit();
	this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0.0, 500.0));
	
	// var pRed = A_UNIQ(UniqResource, ['blue']);
	// var pGreen = A_UNIQ(UniqResource, ['green']);
	// var pBlue = new UniqResource(this);
	// pBlue.color('blue');
	// pBlue.value = 10;
	// A_UNIQ(pBlue);

	// var pBlueCopy = A_UNIQ(UniqResource, ['blue']);
	// trace(pBlueCopy);
	var pBuffer = this.displayManager().videoBufferPool().createResource('*'); 
	pBuffer.create(0, FLAG(a.VBufferBase.ReadableBit));

	var pData = new Float32Array(3 * 128);
	var pData2 = new Float32Array(pData.length);
	for (var i = 0; i < pData.length; i++) {
		pData[i] =  i;
		pData2[i] = i * 10;
	};

	var pDecl = new a.VertexDeclaration([
		VE_FLOAT3('POSITION'),
		VE_FLOAT('POSITION.X', 0),
		VE_FLOAT('POSITION.Z', 8)
		]);
	
	var pVertexData = pBuffer.allocateData(pDecl, pData);
	

	 trace ('------------------------------') ;

	pVertexData.extend([
		VE_FLOAT3('NORMAL'),
		VE_FLOAT('NORMAL.X', 0),
		VE_FLOAT('NORMAL.Y')
		// VE_FLOAT('NORMAL.Z')
		], pData2);

	trace(pVertexData.getTypedData('POSITION'));
	trace(pVertexData.getTypedData('NORMAL'));
	trace(pVertexData.getTypedData('NORMAL.Y'));
	trace(pVertexData.getVertexDeclaration().element('NORMAL.Y').iOffset);
	
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