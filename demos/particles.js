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

    this.pEmittersList = [];

    var pSimpleTorus = simpleTorus(10,10);
    var pSimpleCube = simpleCube();
    var pEmitterObject = pSimpleTorus;
    
    this.pStarTexture = this.pDisplayManager.texturePool().loadResource('../../../../akra-engine-general/media/textures/star4.dds');
    this.pTextTexture = this.pDisplayManager.texturePool().loadResource('../../../../akra-engine-general/media/textures/text.dds');

    var nEmitters = 1;

    var nParticles = 2000;
    var pLiveTimes = new Float32Array(nParticles);
    var pPositions = new Float32Array(nParticles*3);
    var pVelocities = new Float32Array(nParticles*3);
    var pColours = new Float32Array(nParticles*3);
    var pFrequencies = new Float32Array(nParticles*3);
    var fMinLiveTime = 10;
    var fMaxLiveTime = 20;
    var fMaxPositionShift = 15;

    var fMinVelocity = -8;
    var fMaxVelocity = 8;

    // var pSprite = new a.Sprite(this);
    // pSprite.setGeometry(20,40);
    // pSprite.setData([VE_VEC3('COLOR')],new Float32Array([1,0,0,0,0,1,0,0,1,0,1,0]));
    // pSprite.setData([VE_VEC2('TEXTURE_POSITION')],new Float32Array([0,0,0,1,1,0,1,1]));
    // pSprite.centerPosition = Vec3.create(0,10,0);
    // trace(pSprite._pRenderData.toString());
    // pSprite.drawRoutine = spriteDraw;
    // pSprite.setProgram(this.pSpriteProg);

    // this.pSprite = pSprite;
    // pSprite.attachToParent(this.getRootNode());
    // pSprite.create();
    // pSprite.visible = true;

    for(var k=0;k<nEmitters;k++){
        for(var i=0;i<nParticles;i++){
            pLiveTimes[i] = fMinLiveTime + (fMaxLiveTime - fMinLiveTime) * Math.random();

            pPositions[3*i    ] = fMaxPositionShift*(Math.random()-0.5);
            pPositions[3*i + 1] = 0;
            pPositions[3*i + 2] = fMaxPositionShift*(Math.random()-0.5);

            pVelocities[3*i    ] = fMinVelocity + (fMaxVelocity - fMinVelocity)*Math.random();
            pVelocities[3*i + 1] = 10.*(Math.random() - 0.5) + 25.;
            pVelocities[3*i + 2] = fMinVelocity + (fMaxVelocity - fMinVelocity)*Math.random();

            // pColours[3*i    ] = 0.2;
            // pColours[3*i + 1] = 0.4;
            // pColours[3*i + 2] = 0.9 + 0.1*Math.random();
            // 
            pColours[3*i    ] = 0.8 + 0.2 * Math.random();
            pColours[3*i + 1] = 0.5 + 0.5 * Math.random();
            pColours[3*i + 2] = 0.5 + 0.5 * Math.random();

            pFrequencies[3*i    ] = 0.1 + 0.1*Math.random();
            pFrequencies[3*i + 1] = 0.1 + 0.1*Math.random();
            pFrequencies[3*i + 2] = 0.1 + 0.1*Math.random();
        }

    //var pEmitter = this.pEmitter = this.pParticleManager.createEmitter(a.EMITTER.OBJECT,nParticles);
    
        var pEmitter = new a.Emitter(this,a.EMITTER.OBJECT,nParticles);
        this.pEmittersList.push(pEmitter);

        pEmitter.setParticleData([VE_VEC3('PARTICLE_POSITION')],pPositions);
        delete pPositions;
        pEmitter.setParticleData([VE_VEC3('PARTICLE_VELOCITY')],pVelocities);
        delete pVelocities;
        pEmitter.setParticleData([VE_FLOAT('LIVE_TIME')],pLiveTimes);
        delete pLiveTimes;
        pEmitter.setParticleData([VE_VEC3('PARTICLE_COLOUR')],pColours);
        delete pColours;
        pEmitter.setParticleData([VE_VEC3('PARTICLE_FREQUENCY')],pFrequencies);
        delete pFrequencies;
        
        var iPosition = pEmitter.setObjectData([VE_VEC3('POSITION')],pEmitterObject.vertices);
        var iNormal = pEmitter.setObjectData([VE_VEC3('NORMAL')],pEmitterObject.normals);
        pEmitter.setObjectIndex([VE_FLOAT('INDEX_POSITION')],pEmitterObject.INDEX_POSITION);
        pEmitter.setObjectIndex([VE_FLOAT('INDEX_NORMAL')],pEmitterObject.INDEX_NORMAL);
        pEmitter.objectIndex(iPosition,'INDEX_POSITION');
        pEmitter.objectIndex(iNormal,'INDEX_NORMAL');

        pEmitter.setObjectData([VE_VEC2('TEXTURE_POSITION')],new Float32Array([0,0,0,1,1,0,1,1]));

        pEmitter.setLiveTime(Number.POSITIVE_INFINITY);

        pEmitter.updateRoutine = updateRoutine;
        pEmitter.drawRoutine = drawRoutine;

        pEmitter.setTimeAcceleration(3.);

        pEmitter.attachToParent(this.getRootNode());
        pEmitter.create();

        var iX = Math.floor(k/5) - 2;
        var iY = k%5 - 2;

        pEmitter.addRelPosition([20*iX,0,20*iY]);
        pEmitter.setProgram(this.pUpdateVelocityProg);
        pEmitter.setProgram(this.pUpdatePositionProg);
        pEmitter.setProgram(this.pParticleShowProg);
        //pEmitter.setProgram(this.pParticleShowBillboardProg);
        //pEmitter.setProgram(this.pParticleShowPointProg);

        pEmitter.activate();
    }
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

    pParticleDemo.pTextTexture.activate(1);
    pProgram.applyInt('spriteTexture',1);
}

