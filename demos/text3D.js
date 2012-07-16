Include('geom.js')

function Text3D() {
    A_CLASS;
};

EXTENDS(Text3D, a.Engine);

Text3D.prototype.oneTimeSceneInit = function () {
    'use strict';
    
    this.notifyOneTimeSceneInit();
    this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0.0, 500.0));
    this.showStats(true);
    return true;
}; 

Text3D.prototype.restoreDeviceObjects = function () {
    this.notifyRestoreDeviceObjects();
    return true;
};


Text3D.prototype.initDeviceObjects = function () {
    this.notifyInitDeviceObjects();

    var me = this;
    var pShaderSource;
    var pProgram;

    var pFont = new a.Font3D(this,100,"#ff0000","sans-serif",false,false);

    function addMeshToScene(pEngine, pMesh) {
        var pSceneObject = new a.SceneModel(pEngine, pMesh);
        pSceneObject.attachToParent(pEngine.getRootNode());
        pSceneObject.create();
        pSceneObject.bNoRender = true;
        return pSceneObject;
    }


    this.pPlane = addMeshToScene(this, sceneSurface(this));
    this.pPlane.setScale(200.0);

    this.pDrawMeshProg = a.loadProgram(this, '../effects/mesh.glsl');
    this.pDrawPlaneProg = a.loadProgram(this, '../effects/plane.glsl');
    // this.pUpdateVelocityProg = a.loadProgram(this,'../effects/particle_update_velocity.glsl');
    // this.pUpdatePositionProg = a.loadProgram(this,'../effects/particle_update_position.glsl');
    // this.pParticleShowProg = a.loadProgram(this,'../effects/particle_show.glsl');
    // this.pParticleShowBillboardProg = a.loadProgram(this,'../effects/particle_show_billboard.glsl');
    // this.pParticleShowPointProg = a.loadProgram(this,'../effects/particle_show_point.glsl');
    this.pSpriteProg = a.loadProgram(this,'../effects/sprite.glsl');
    
    
    this.pStarTexture = this.pDisplayManager.texturePool().loadResource('../../../../akra-engine-general/media/textures/star4.dds');
    this.pTextTexture = pFont;// = this.pDisplayManager.texturePool().loadResource('../../../../akra-engine-general/media/textures/text.dds');


    var pSprite = new a.Sprite(this);
    pSprite.setGeometry(20,20);
    pSprite.setData([VE_VEC2('TEXTURE_POSITION')],new Float32Array([0,0,0,1,1,0,1,1]));
    pSprite.centerPosition = Vec3.create(0,10,0);
    trace(pSprite._pRenderData.toString());
    pSprite.drawRoutine = spriteDraw;
    pSprite.setProgram(this.pSpriteProg);

    this.pSprite = pSprite;
    pSprite.attachToParent(this.getRootNode());
    pSprite.create();
    pSprite.visible = true;

    var pCamera = this.getActiveCamera();
    pCamera.addRelPosition(-8.0, 5.0, 11.0);
    pCamera.addRelRotation(-3.14/5, -3.14/15, 0);
    window.pText3D = this;

    return true;
};

Text3D.prototype.directRender = function() {
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

Text3D.prototype.deleteDeviceObjects = function () {
    this.notifyDeleteDeviceObjects();
    return true;
};

Text3D.prototype.updateScene = function () {
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
    var App = new Text3D();
    if (!App.create('canvas') || !App.run()) {
        alert('something wrong....');
    }
}

function spriteDraw(pProgram){
    'use strict';
    var pText3D = window.pText3D;
    var pCamera = pText3D._pDefaultCamera;
    var pSprite = pText3D.pSprite;
    pProgram.applyMatrix4('model_mat', pSprite.worldMatrix());
    pProgram.applyMatrix4('proj_mat', pCamera.projectionMatrix());
    pProgram.applyMatrix4('view_mat', pCamera.viewMatrix());

    pText3D.pTextTexture.activate(0);
    pProgram.applyInt('spriteTexture',0);
}