function MyGame() {
	A_CLASS;
}
a.extend(MyGame, a.Engine);
MyGame.prototype.oneTimeSceneInit = function () {
	this.notifyOneTimeSceneInit();
	this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0.0, 500.0));
	this.showStats(true);
	return true;
}
MyGame.prototype.restoreDeviceObjects = function () {
	this.notifyRestoreDeviceObjects();
	return true;
}

MyGame.prototype.initTestScene = function (pVerticesData, pNormalsData, pIndicesData) {

	var pVideoBuffer = this.pVideoBuffer = this.displayManager().videoBufferPool().createResource('video_test');
	var pCommonData = new Float32Array(pNormalsData.concat(pVerticesData).concat(pIndicesData));
	pVideoBuffer.create(pCommonData.byteLength, 0, pCommonData);

	var pVertexDecl = new a.VertexDeclaration([{nCount:3, eType:a.DTYPE.FLOAT, eUsage:a.DECLUSAGE.POSITION}]);
	var pNormalDecl = new a.VertexDeclaration([{nCount:3, eType:a.DTYPE.FLOAT, eUsage:a.DECLUSAGE.NORMAL}]);
	var pIndexDecl = new a.VertexDeclaration([{nCount:1, eType:a.DTYPE.FLOAT, eUsage:a.DECLUSAGE.INDEX3}]);

	var pNormals = pVideoBuffer.getVertexData(0, pNormalsData.length / 3, pNormalDecl);
	var pVertices = pVideoBuffer.getVertexData(pNormalsData.length * 4, pVerticesData.length / 3, pVertexDecl);
	var pIndices = pVideoBuffer.getVertexData((pNormalsData.length + pVerticesData.length) * 4, pIndicesData.length,
	                                          pIndexDecl);

	//scene rect
	var pScreenBuffer = this.displayManager().vertexBufferPool().createResource('screen_buffer');
	var pScreenDecl = new a.VertexDeclaration([{nCount: 2, eType: a.DTYPE.FLOAT, eUsage:a.DECLUSAGE.POSITION}]);
	var pScreenData = new Float32Array([-1,-1,  1,-1,  -1,1,  1,1]);
	pScreenBuffer.create(pScreenData.byteLength, 0, pScreenData);
	var pScreen = this.pScreen = pScreenBuffer.getVertexData(0, 4, pScreenDecl);

	var pProgram = this.pShaderProgram = this.displayManager().shaderProgramPool().createResource('prog_0');

	var sVSCode = a.ajax({ url:  '../effects/raycasting.vert', async:false }).data;
	var sFSCode = a.ajax({ url:  '../effects/raycasting.frag', async:false }).data;

	pProgram.create(sVSCode, sFSCode, true);
	pProgram.activate();
	pProgram.applyBuffer(pScreen);
	pProgram.applyInt(0);
	pProgram.applyFloat('NormalsOffset', pNormals.getOffset() / 4. + VIDEOBUFFER_HEADER_SIZE);
	pProgram.applyFloat('VerticesOffset', pVertices.getOffset() / 4. + VIDEOBUFFER_HEADER_SIZE);
	pProgram.applyFloat('IndicesOffset', pIndices.getOffset() / 4. + VIDEOBUFFER_HEADER_SIZE);
	pVideoBuffer.activate(0);

	this.bReadyForRender = true;

	return true;
};

MyGame.prototype.initDeviceObjects = function () {
	this.notifyInitDeviceObjects();

	var pGame = this;
	(new ObjModel()).load('/media/models/dodecahedron.obj', function () {
		pGame.initTestScene(this.getVertices(), this.getNormals(), this.getIndexes());
	});

	return true;
};

MyGame.prototype.deleteDeviceObjects = function () {
	this.notifyDeleteDeviceObjects();
	return true;
};

MyGame.prototype.littleRender = function () {
	if (!this.bReadyForRender) {
		return;
	}

	var pProgram = this.pShaderProgram;
	var pScreen = this.pScreen;

	pProgram.applyVector3('cameraPos', this.getActiveCamera().worldPosition());

	this.pDevice.drawArrays(a.PRIMTYPE.TRIANGLESTRIP, 0, 4);
};

MyGame.prototype.updateScene = function () {
	this.updateCamera(1.0, 0.1, null, 30.0, false);
	if (this.pKeymap.isMousePress() && this.pKeymap.isMouseMoved()) {
		var pCamera = this.getActiveCamera(),
			fdX = this.pKeymap.mouseShitfX(),
			fdY = this.pKeymap.mouseShitfY(),
			pScreen = a.info.screen;

		fdX /= pScreen.width / 10.0;
		fdY /= pScreen.height / 10.0;

		pCamera.addRelRotation(-fdX, -fdY, 0);
	}
	return this.notifyUpdateScene();
}

if (!a.info.support.webgl) {
	alert('Error:: Your browser does not support WebGL.');
}
else {
	var App = new MyGame("canvas");
	if (!App.create() || !App.run()) {
		alert('something wrong....');
	}
}