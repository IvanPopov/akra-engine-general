Include('geom.js')

function TarrainDemo() {
	A_CLASS;


	//Ландшафт
	this.pTerrainSystem = null;

	//Картын для ландшафта
	this.pTerrainMap = [];
};

EXTENDS(TarrainDemo, a.Engine);

TarrainDemo.prototype.oneTimeSceneInit = function () {
	'use strict';

	this.notifyOneTimeSceneInit();
	this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0, 300.0));
	this.showStats(true);
	
	this.initShaders();

    //this.pSkyMap = this.pDisplayManager.texturePool().createResource("sky box texture");
   //this.pSkyMap.loadResource("/akra-engine-general/media/textures/sky_box1-1.dds");

	//Загрузка основеыз карт
	this.pTerrainMap["height"] = this.pDisplayManager.imagePool().createResource("main_terrain_height_map.dds");
	//this.pTerrainMap["height"].loadResource("/akra-engine-general/media/textures/terrain1_heightmap_16L.dds");
	this.pTerrainMap["height"].loadResource("/akra-engine-general/media/textures/main_terrain_height_map.dds");
	this.pTerrainMap["normal"] = this.pDisplayManager.imagePool().createResource("main_terrain_normal_map.dds");
	this.pTerrainMap["normal"].loadResource("/akra-engine-general/media/textures/main_terrain_normal_map.dds");

	return true;
};

TarrainDemo.prototype.initShaders = function () {
	var pManager = this.shaderManager();
	
	pManager.loadEffectFile('http://akra/akra-engine-general/effects/SystemEffects.afx', true);
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/resize_texture.afx', true);
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/Plane.afx', true);
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/mesh.afx', true);
//    pManager.loadEffectFile('http://akra/akra-engine-general/effects/mesh2.afx');
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/mesh_geometry.afx', true);
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/mesh_texture.afx', true);
//    pManager.loadEffectFile('http://akra/akra-engine-general/effects/samplers_array.afx', true);
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/TextureToScreen.afx', true);
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/prepare_shadows.afx', true);
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/prepareDeferredShading.afx', true);
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/deferredShading.afx', true);
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/apply_lights_and_shadows.afx', true);
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/fxaa.afx', true);
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/skybox.afx', true);
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/terrain.afx', true);

	pManager.loadEffectFile('http://akra/akra-engine-general/effects/terrain_sweep.afx', true);

};

TarrainDemo.prototype.restoreDeviceObjects = function () {
	this.notifyRestoreDeviceObjects();
	return true;
};


TarrainDemo.prototype.initDeviceObjects = function () {
	'use strict';

	this.notifyInitDeviceObjects();

    this.setupLighting();



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

	//this.pDrawPlaneProg = a.loadProgram(this, '../effects/plane.glsl');
	//this.pDrawTerrainProgram = a.loadProgram(this, '../effects/terrainROAM.glsl');

	this.pTerrainSystem = new a.TerrainROAM(this);
	//this.pTerrainSystem = new a.TerrainROAM(this);
	// Создание карты высот
	//this.pHeightImage = this.pDisplayManager.imagePool().createResource("height map");
	//this.pHeightImage.create(128, 128, 0x1908,0);

	console.log("Генерация Шума перлина");
	//this.pHeightImage.generatePerlinNoise(0.01, 5, 0.6);
	//this.pHeightImage.generatePerlinNoise(0.01, 5, 0.6);
	console.log("Генерация шума пелина завершена");

	//создание ????
    var pTerrainNode = new a.SceneNode(this);
    pTerrainNode.create();
    pTerrainNode.attachToParent(this.getRootNode());
    pTerrainNode.addRelRotation(Math.PI/2, Math.PI/2, Math.PI/2);
    pTerrainNode.update();


	this.pTerrainSystem.create(this.getRootNode(), this.pTerrainMap, this.getWorldExtents(),5,4,4,
		"main_terrain");
	console.log("Terrain создан");

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

TarrainDemo.prototype.setupLighting = function () {
    var pLightOmniShadow = this.pLightPoint = new a.LightPoint(this, true, true, 2048 / 1);
    pLightOmniShadow.create();
    pLightOmniShadow.attachToParent(this.getRootNode());
    pLightOmniShadow.name = "omni_shadow";

//    var pMesh = this.visualizeNode(pLightOmniShadow, a.geom.cube(this));
//    pMesh[0].material.emissive = new a.Color4f(1., 1., 1., 1.);

    var m4fLook = Mat4.lookAt(Vec3(3, 5, 4), Vec3(0., 1., 0.), Vec3(0, 1, 0), Mat4());

    pLightOmniShadow.accessLocalMatrix().set(m4fLook.inverse());
    pLightOmniShadow.isActive = false;

    var pLightOmni = new a.LightPoint(this);
    pLightOmni.create();
    pLightOmni.attachToParent(this.getRootNode());
    pLightOmni.addPosition(Vec3(0., 750., 1000.));
    pLightOmni.lightParameters.attenuation.set(0.1, 0., 0);
    pLightOmni.isActive = true;
    pLightOmni.name = "omni";

//    var pMesh = this.visualizeNode(pLightOmni, a.geom.frustum(this));
//    pMesh[0].material.emissive = new a.Color4f(1., 1., 1., 1.);

    var pLightParameters = pLightOmni.lightParameters;
    pLightParameters.diffuse.set(0.1);
    pLightParameters.specular.set(0.1);

    var pLightProject = new a.LightPoint(this, false, true, 2048 / 1);
    pLightProject.create();
    pLightProject.attachToParent(this.getRootNode());

//    pMesh = this.visualizeNode(pLightProject, a.geom.frustum(this));
//    pMesh[0].material.emissive = new a.Color4f(1., 1., 1., 1.);

    m4fLook = Mat4.lookAt(Vec3(-10, 4, 0), Vec3(0., 1., 0.), Vec3(0, 1, 0), Mat4());
    pLightProject.accessLocalMatrix().set(m4fLook.inverse());
    pLightProject.camera.setProjParams(Math.PI / 5, 1, 0.01, 1000);
    //pLightProject.lightParameters.attenuation.set(0.3,0.,0.);

    pLightProject.isActive = false;

    pLightProject.name = "project";

    var pLightProjectShadow = new a.LightPoint(this, false, true, 2048 / 1);
    pLightProjectShadow.create();
    pLightProjectShadow.attachToParent(this.getRootNode());

//    pMesh = this.visualizeNode(pLightProjectShadow, a.geom.frustum(this));
//    pMesh[0].material.emissive = new a.Color4f(1., 1., 1., 1.);

    m4fLook = Mat4.lookAt(Vec3(-15, 4, -15), Vec3(0., 1., 0.), Vec3(0, 1, 0), Mat4());
    pLightProjectShadow.accessLocalMatrix().set(m4fLook.inverse());
    pLightProjectShadow.camera.setProjParams(Math.PI / 5, 1, 0.01, 1000);

    pLightProjectShadow.isActive = false;
    pLightProjectShadow.name = "project_shadow";

//    this.pLightProjects = [pLightProject, pLightProjectShadow];
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