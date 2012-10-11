Include('geom.js')

function TarrainDemo() {
	A_CLASS;


	//���������
	this.pTerrainSystem = null;

	//������������ ����� ��� ���������
	this.pTerrainMap = [];
};

EXTENDS(TarrainDemo, a.Engine);

TarrainDemo.prototype.oneTimeSceneInit = function () {
	'use strict';

	this.notifyOneTimeSceneInit();
	this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0, 500.0));
	this.showStats(true);

	// �������� ������� ����������� ���������
	this.pTerrainMap["height"] = this.pDisplayManager.imagePool().createResource("terrain1_heightmap.dds");
	this.pTerrainMap["height"].loadResource("/akra-engine-general/media/textures/terrain1_heightmap.dds");
	this.pTerrainMap["normal"] = this.pDisplayManager.imagePool().createResource("terrain1_normal.jpeg");
	this.pTerrainMap["normal"].loadResource("/akra-engine-general/media/textures/terrain1_normal.jpeg");

	return true;
};

TarrainDemo.prototype.restoreDeviceObjects = function () {
	this.notifyRestoreDeviceObjects();
	return true;
};


TarrainDemo.prototype.initDeviceObjects = function () {
	'use strict';

	this.notifyInitDeviceObjects();

	var me = this;

	function addMeshToScene(pEngine, pMesh, pParent) {
		var pSceneObject = new a.SceneModel(pEngine, pMesh);
		pSceneObject.create();
		pSceneObject.attachToParent(pParent || pEngine.getRootNode());
		return pSceneObject;
	}
	this.appendMesh = function (pMesh, pNode) {
		return addMeshToScene(me, pMesh, pNode);
	}

	//this.pPlane = addMeshToScene(this, sceneSurface(this));
	//this.pPlane.bNoRender = true;
	//this.pPlane.setScale(200.0);

	this.pDrawPlaneProg = a.loadProgram(this, '../effects/plane.glsl');
	this.pDrawTerrainProgram = a.loadProgram(this, '../effects/terrainROAM.glsl');


	this.pTerrainSystem = new a.TerrainROAM(this);
	// ��������� ��������� ����� �����
	//this.pHeightImage = this.pDisplayManager.imagePool().createResource("height map");
	//this.pHeightImage.create(128, 128, 0x1908,0);

	console.log("������� ����� �����");
	//this.pHeightImage.generatePerlinNoise(0.01, 5, 0.6);
	//this.pHeightImage.generatePerlinNoise(0.01, 5, 0.6);
	console.log("��� ������� �� ����� ����� ������������");

	//C������� ��������� �� ����� �����
	this.pTerrainSystem.create(this.getRootNode(), this.pTerrainMap, this.getWorldExtents(),5,4,4,
		"terrain1");
	console.log("Terrain �� ����� ����� �������");

	var pCamera = this.getActiveCamera();
	pCamera.addRelPosition(0, -750, 1000);
	pCamera.addRelRotation(0, 0, 0);
	//pCamera.addRelPosition(0, -750, 1000.0);
	//pCamera.addRelRotation(-3.14/200, 3.14/4, 0);

	return true;
};

TarrainDemo.prototype.deleteDeviceObjects = function () {
	this.notifyDeleteDeviceObjects();
	return true;
};


TarrainDemo.prototype.updateScene = function ()
{
	this.pTerrainSystem.readUserInput();

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
};

if (!a.info.support.webgl) {
	alert('Error:: Your browser does not support WebGL.');
}
else {
	var App = new TarrainDemo();
	if (!App.create('canvas') || !App.run()) {
		alert('something wrong....');
	}
}