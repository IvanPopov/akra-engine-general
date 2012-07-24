Include('geom.js')

function TextDemo() {
    A_CLASS;
    STATIC(fMoveSpeed,1.);
};

EXTENDS(TextDemo, a.Engine);

TextDemo.prototype.oneTimeSceneInit = function () {
    'use strict';
    
    this.notifyOneTimeSceneInit();
    this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0.0, 500.0));
    this.showStats(true);
    return true;
}; 

TextDemo.prototype.restoreDeviceObjects = function () {
    this.notifyRestoreDeviceObjects();
    return true;
};


TextDemo.prototype.initDeviceObjects = function () {
    this.notifyInitDeviceObjects();

    var me = this;
    var pShaderSource;
    var pProgram;

    var pFont = new a.Font3D(this,15,"monospace",true,false);
    var pText = new a.Text3D(this,pFont);
    pText.setText('ASSDF\n&dhfgjksa^\nEFGH{_}:; ');
    pText.centerPosition = Vec3.create(0,10,0);
    pText.fontColor = [0.,0.,0.,1.];
    pText.backgroundColor = [.0,1.0,0.0,0.];
    pText.fixedSize = true;
    //pText.setDistanceMultiplier(0.1);
    pText.visible = true;
    pText.attachToParent(this.getRootNode());
    pText.create();

    function addMeshToScene(pEngine, pMesh) {
        var pSceneObject = new a.SceneModel(pEngine, pMesh);
        pSceneObject.attachToParent(pEngine.getRootNode());
        pSceneObject.create();
        pSceneObject.bNoRender = true;
        return pSceneObject;
    }


    this.pPlane = addMeshToScene(this, sceneSurface(this));
    this.pPlane.setScale(200.0);


    this.pDrawPlaneProg = a.loadProgram(this, '../effects/plane.glsl');

    var pCamera = this.getActiveCamera();
    pCamera.addRelPosition(-8.0, 5.0, 11.0);
    pCamera.addRelRotation(-3.14/5, -3.14/15, 0);
    window.pTextDemo = this;

    return true;
};

TextDemo.prototype.directRender = function() {
    'use strict';
    var pCamera = this._pDefaultCamera;

    function draw(pProgram, pModel, hasMat) {
        hasMat = ifndef(hasMat, true);
        pProgram.applyMatrix4('model_mat', pModel.worldMatrix());
        pProgram.applyMatrix4('proj_mat', pCamera.projectionMatrix());
        pProgram.applyMatrix4('view_mat', pCamera.viewMatrix());
        pModel.findMesh().draw();
    }    

    //draw plane
    this.pDrawPlaneProg.activate();
    var pDevice = this.pDevice;

    // pDevice.disable(pDevice.DEPTH_TEST);
    // pDevice.enable(pDevice.BLEND);
    // pDevice.blendFunc(pDevice.SRC_ALPHA, pDevice.ONE_MINUS_SRC_ALPHA);
    
    draw(this.pDrawPlaneProg, this.pPlane, false);
    //this.pParticleManager._renderCallback();
};

TextDemo.prototype.deleteDeviceObjects = function () {
    this.notifyDeleteDeviceObjects();
    return true;
};

TextDemo.prototype.updateScene = function () {
    if(this.pKeymap.isKeyPress(a.KEY.ADD)){
        statics.fMoveSpeed *= 2.;
    }
    if(this.pKeymap.isKeyPress(a.KEY.SUBTRACT)){
        statics.fMoveSpeed /= 2.;
    }
    this.updateCamera(statics.fMoveSpeed, 0.1, null, 30.0, false);
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
    var App = new TextDemo();
    if (!App.create('canvas') || !App.run()) {
        alert('something wrong....');
    }
}