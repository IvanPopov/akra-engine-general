Include('geom.js')

function TarrainDemo() {
	A_CLASS;


	//Ландшафта
	this.pTerrainSystem = null;

	//Используемые рисунки
	this.pHeightImage = null;
	this.pBlendImage = null;

	//Используемые текстуры
	this.pBlendMap = null;
	this.pGrass = null;
	this.pRock = null;
	//this.pRockBump = null;
	this.pDirt = null;
};

EXTENDS(TarrainDemo, a.Engine);

TarrainDemo.prototype.oneTimeSceneInit = function () {
	'use strict';

	this.notifyOneTimeSceneInit();
	this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0, 500.0));
	this.showStats(true);

	// Загрузка текстур поверхности ландшавта
	this.pGrass = this.pDisplayManager.texturePool().createResource("grass");
	this.pRock = this.pDisplayManager.texturePool().createResource("rock");
	//this.pRockBump = this.pDisplayManager.texturePool().createResource("rock bump");
	this.pDirt = this.pDisplayManager.texturePool().createResource("dirt");

	this.pGrass.loadResource("/akra-engine-general/media/textures/grass.dds");
	this.pRock.loadResource("/akra-engine-general/media/textures/rock.dds");
	//this.pRockBump.loadResource("/media/textures/rock2_bump.dds");
	this.pDirt.loadResource("/akra-engine-general/media/textures/dirt.dds");


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

	this.pPlane = addMeshToScene(this, sceneSurface(this));
	this.pPlane.bNoRender = true;
	this.pPlane.setScale(200.0);

	this.pDrawPlaneProg = a.loadProgram(this, '../effects/plane.glsl');
	this.pDrawTerrainProgram = a.loadProgram(this, '../effects/terrain.glsl');


	this.pTerrainSystem = new a.Terrain(this);
	// Генерация рандомной карты высот
	this.pHeightImage = this.pDisplayManager.imagePool().createResource("height map");
	this.pHeightImage.create(128, 128, 0x1908,0);

	console.log("Создана карта высот");
	this.pHeightImage.generatePerlinNoise(0.01, 5, 0.6);
	console.log("Шум перлина на крате высот сгенерирован");

	//Cоздание ландшавта по карте высот
	this.pTerrainSystem.create(this.getRootNode(), this.pHeightImage, this.getWorldExtents(),3);
	console.log("Terrain по карте высот создана");


	//Создание карты смешения для покрытия текстурами ландшавта
	this.pBlendImage = this.pDisplayManager.imagePool().createResource("image map");

	//this.pBlendImage.create(256, 256,a.FORMAT.RGBA8,0);
	this.pBlendImage.create(256, 256, 0x1908,0);
	console.log("Cоздан рисунок для смешивания");

	//Определение характеристик смешивания
	var pElevation = new Array(3);
	for (var i = 0; i < 3; i++) {
		pElevation[i] = new this.pTerrainSystem.elevationData();
	}

	// grass (all elevations and slopes)
	pElevation[0].fMinElevation = 0;
	pElevation[0].fMaxElevation = 500;
	pElevation[0].fMinNormalZ = -1.0;
	pElevation[0].fMaxNormalZ = 1.0;
	pElevation[0].fStrength = 1.0;

	// rock (all elevations, steep slopes)
	pElevation[1].fMinElevation = 10;
	pElevation[1].fMaxElevation = 500;
	pElevation[1].fMinNormalZ = 0.0;
	pElevation[1].fMaxNormalZ = 0.85;
	pElevation[1].fStrength = 10.0;

	// dirt (high elevation, flat slope)
	pElevation[2].fMinElevation = 300;
	pElevation[2].fMaxElevation = 500;
	pElevation[2].fMinNormalZ = 0.75;
	pElevation[2].fMaxNormalZ = 1.0;
	pElevation[2].fStrength = 20.0;

	this.pTerrainSystem.generateBlendImage(this.pBlendImage, pElevation, 3);
	console.log("Сгенерирована текстура для смешивания");
	this.pBlendImage.randomChannelNoise(3, 200, 255);

	this.pBlendMap = this.pDisplayManager.texturePool().createResource("blend map");
	this.pBlendMap.uploadImage(this.pBlendImage);
	this.pBlendImage.release();
	this.pBlendImage=null;

	// Создание материала поверхности
	// и загрука текстур в него
	//this.pSurfaceMaterial = this.pDisplayManager.surfaceMaterialPool().createResource("ground material");
	//this.pSurfaceMaterial.setTexture(0, this.pBlendMap);
	//this.pSurfaceMaterial.setTexture(1, this.pGrass);
	//this.pSurfaceMaterial.setTexture(2, this.pRock);
	//this.pSurfaceMaterial.setTexture(3, this.pDirt);
	//this.pSurfaceMaterial.setTexture(4, this.pRockBump);

	// добавление в метод рендеринга материала поверхности, и привязка его к ландшафту
	//this.pRenderMethod.setMaterial(0, this.pSurfaceMaterial);
	//this.pTerrainSystem.setRenderMethod(this.pRenderMethod);



	var pCamera = this.getActiveCamera();
	pCamera.addRelPosition(0, -750, 1000.0);
	pCamera.addRelRotation(-3.14/200, 3.14/4, 0);

	return true;
};

TarrainDemo.prototype.directRender = function() {
	'use strict';

	var pCamera = this._pDefaultCamera;

	function draw(pProgram, pModel, hasMat) {
		hasMat = ifndef(hasMat, true);
		pProgram.applyMatrix4('model_mat', pModel.worldMatrix());
		pProgram.applyMatrix4('proj_mat', pCamera.projectionMatrix());
		pProgram.applyMatrix4('view_mat', pCamera.viewMatrix());

		if (hasMat) {
			pProgram.applyMatrix3('normal_mat', pModel.normalMatrix());
			pProgram.applyVector3('eye_pos', pCamera.worldPosition());
		}

		pModel.findMesh().draw();
	}

	//draw plane
	this.pDrawPlaneProg.activate();
	draw(this.pDrawPlaneProg, this.pPlane, false);
};

TarrainDemo.prototype.deleteDeviceObjects = function () {
	this.notifyDeleteDeviceObjects();
	return true;
};

TarrainDemo.prototype.updateScene = function () {
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