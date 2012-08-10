Include('geom.js')

function MeshDemo() {
	A_CLASS;
};

EXTENDS(MeshDemo, a.Engine);

MeshDemo.prototype.oneTimeSceneInit = function () {
	'use strict';
	
	this.notifyOneTimeSceneInit();
	this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0.0, 500.0));
    this.showStats(true);
	return true;
}; 

MeshDemo.prototype.restoreDeviceObjects = function () {
	this.notifyRestoreDeviceObjects();
	return true;
};


MeshDemo.prototype.initDeviceObjects = function () {
	this.notifyInitDeviceObjects();

	var me = this;
    var pShaderSource;
    var pProgram;

    function addMeshToScene(pEngine, pMesh) {
        var pSceneObject = new a.SceneModel(pEngine, pMesh);
        pSceneObject.attachToParent(pEngine.getRootNode());
        pSceneObject.create();
        pSceneObject.addRelPosition(-3, 2.0, 0);
        trace(pMesh.getSubset(0).data.toString());
        return pSceneObject;
    }

    this.pTorus = addMeshToScene(this, torus(this, 
        a.Mesh.VB_READABLE|a.Mesh.RDS_ADVANCED_INDEX));
    this.pPlane = addMeshToScene(this, plane(this));

    this.pPlane.addRelPosition(0, -2.0, 0);
    this.pPlane.setScale(100.0);

    this.pDrawMeshProg = a.loadProgram(this, '../effects/mesh_ai.glsl');
    this.pDrawPlaneProg = a.loadProgram(this, '../effects/plane.glsl');

    var pCamera = this.getActiveCamera();
    pCamera.addRelPosition(-8.0, 5.0, 11.0);
    pCamera.addRelRotation(-3.14/5, -3.14/15, 0);

	return true;
};

MeshDemo.prototype.directRender = function() {
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

        pModel._pMesh.draw();
    }    

    this.pDrawMeshProg.activate();
    this.pDevice.enableVertexAttribArray(0);
    this.pDevice.enableVertexAttribArray(1);
    this.pDevice.enableVertexAttribArray(2);
    this.pTorus.addRelRotation(0.01, 0., -0.01);        
    draw(this.pDrawMeshProg, this.pTorus);

    //draw plane
    this.pDrawPlaneProg.activate();
    this.pDevice.disableVertexAttribArray(2);

    draw(this.pDrawPlaneProg, this.pPlane, false);
};

MeshDemo.prototype.deleteDeviceObjects = function () {
	this.notifyDeleteDeviceObjects();
	return true;
};

MeshDemo.prototype.updateScene = function () {
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
	var App = new MeshDemo();
	if (!App.create('canvas') || !App.run()) {
		alert('something wrong....');
	}
}