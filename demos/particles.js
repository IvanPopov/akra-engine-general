Include('geom.js')

function ParticlesDemo() {
    A_CLASS;
};

EXTENDS(ParticlesDemo, a.Engine);

ParticlesDemo.prototype.oneTimeSceneInit = function () {
    'use strict';
    
    this.notifyOneTimeSceneInit();
    this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0.0, 500.0));
    this.showStats(true);
    return true;
}; 

ParticlesDemo.prototype.restoreDeviceObjects = function () {
    this.notifyRestoreDeviceObjects();
    return true;
};


ParticlesDemo.prototype.initDeviceObjects = function () {
    this.notifyInitDeviceObjects();

    var me = this;
    var pShaderSource;
    var pProgram;


    function addMeshToScene(pEngine, pMesh) {
        var pSceneObject = new a.SceneModel(pEngine, pMesh);
        pSceneObject.create();
		pSceneObject.attachToParent(pEngine.getRootNode());
        pSceneObject.bNoRender = true;
        return pSceneObject;
    }


    this.pPlane = addMeshToScene(this, sceneSurface(this));
    this.pPlane.setScale(200.0);

    this.pDrawPlaneProg = a.loadProgram(this, '../effects/plane.glsl');
    this.pSpriteProg = a.loadProgram(this,'../effects/sprite.glsl');
    
    
    this.pSpriteTexture = this.pDisplayManager.texturePool().loadResource(document.getElementById("video"));

    var pSprite = new a.Sprite(this);
    pSprite.setGeometry(64,36);
    pSprite.setData([VE_VEC3('COLOR')],new Float32Array([1,0,0,0,0,1,0,0,1,0,1,0]));
    pSprite.setData([VE_VEC2('TEXTURE_POSITION')],new Float32Array([0,0,0,1,1,0,1,1]));
    pSprite.centerPosition = Vec3.create(0,10,0);
    trace(pSprite._pRenderData.toString());
    pSprite.drawRoutine = spriteDraw;
    pSprite.setProgram(this.pSpriteProg);

    this.pSprite = pSprite;
	pSprite.create();
    pSprite.attachToParent(this.getRootNode());    
    pSprite.visible = true;

    var pCamera = this.getActiveCamera();
    pCamera.addRelPosition(-8.0, 5.0, 11.0);
    pCamera.addRelRotation(-3.14/5, -3.14/15, 0);
    window.pParticleDemo = this;

    return true;
};

ParticlesDemo.prototype.directRender = function() {
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
    
    draw(this.pDrawPlaneProg, this.pPlane, false);
    //this.pParticleManager._renderCallback();
};

ParticlesDemo.prototype.deleteDeviceObjects = function () {
    this.notifyDeleteDeviceObjects();
    return true;
};

ParticlesDemo.prototype.updateScene = function () {
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
    var App = new ParticlesDemo();
    if (!App.create('canvas') || !App.run()) {
        alert('something wrong....');
    }
}

function simpleCube () {

    var pVerticesData = new Float32Array([
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5
    ]);
    var pNormalsData = new Float32Array([
        1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, -1.0
    ]);
    var pVertexIndicesData = new Float32Array([
        0, 2, 3, 0, 3, 1,
        0, 1, 5, 0, 5, 4,
        6, 7, 3, 6, 3, 2,
        0, 4, 6, 0, 6, 2,
        3, 7, 5, 3, 5, 1,
        5, 7, 6, 5, 6, 4
    ]);
    var pNormalIndicesData = new Float32Array([
        4, 4, 4, 4, 4, 4,
        2, 2, 2, 2, 2, 2,
        3, 3, 3, 3, 3, 3,
        1, 1, 1, 1, 1, 1,
        0, 0, 0, 0, 0, 0,
        5, 5, 5, 5, 5, 5
    ]);

    return {'vertices' :  new Float32Array(pVerticesData),'normals' :  new Float32Array(pNormalsData),
    'INDEX_POSITION' : new Float32Array(pVertexIndicesData),'INDEX_NORMAL' : new Float32Array(pNormalIndicesData)};
}

function spriteDraw(pProgram){
    'use strict';
    var pParticleDemo = window.pParticleDemo;
    var pCamera = pParticleDemo._pDefaultCamera;
    var pSprite = pParticleDemo.pSprite;
    pProgram.applyMatrix4('model_mat', pSprite.worldMatrix());
    pProgram.applyMatrix4('proj_mat', pCamera.projectionMatrix());
    pProgram.applyMatrix4('view_mat', pCamera.viewMatrix());
	
	
	pParticleDemo.pSpriteTexture.loadResource(document.getElementById("video"));
    pParticleDemo.pSpriteTexture.applyParameter(a.TPARAM.WRAP_S, a.TWRAPMODE.CLAMP_TO_EDGE);
    pParticleDemo.pSpriteTexture.applyParameter(a.TPARAM.WRAP_T, a.TWRAPMODE.CLAMP_TO_EDGE);
	
	
	
    pParticleDemo.pSpriteTexture.activate(1);

    pProgram.applyInt('spriteTexture',1);
}