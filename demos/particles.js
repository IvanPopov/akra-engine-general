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
        pSceneObject.attachToParent(pEngine.getRootNode());
        pSceneObject.create();
        pSceneObject.bNoRender = true;
        return pSceneObject;
    }


    this.pPlane = addMeshToScene(this, sceneSurface(this));
    this.pPlane.setScale(200.0);

    this.pDrawMeshProg = a.loadProgram(this, '../effects/mesh.glsl');
    this.pDrawPlaneProg = a.loadProgram(this, '../effects/plane.glsl');
    this.pParticleShowProg = a.loadProgram(this,'../effects/particle_show.glsl');
    this.pUpdateVelocityProg = a.loadProgram(this,'../effects/particle_update_velocity.glsl');
    this.pUpdatePositionProg = a.loadProgram(this,'../effects/particle_update_position.glsl');
    
    //this.pDrawMeshI2IProg = a.loadProgram(this, '../effects/mesh_ai.glsl');
    //

    var pSimpleTorus = simpleTorus(10,10);
    var pSimpleCube = simpleCube();
    var pEmitterObject = pSimpleCube;

    this.pParticleManager = new a.ParticleManager(this);

    //trace(this.pParticleManager);
    
    var nParticles = 500;
    var pLiveTimes = [];
    var pPositions = [];
    var pVelocities = [];
    var pColours = [];
    var pFrequencies = [];
    var fMinLiveTime = 10;
    var fMaxLiveTime = 20;
    var fMaxPositionShift = 15;

    var fMinVelocity = -2;
    var fMaxVelocity = 2;

    for(var i=0;i<nParticles;i++){
        pLiveTimes.push(fMinLiveTime + (fMaxLiveTime - fMinLiveTime) * Math.random());
        pPositions.push(fMaxPositionShift*(Math.random()-0.5),0,fMaxPositionShift*(Math.random()-0.5));
        pVelocities.push(fMinVelocity + (fMaxVelocity - fMinVelocity)*Math.random(),10.*Math.random() + 10.,fMinVelocity + (fMaxVelocity - fMinVelocity)*Math.random());
        pColours.push(0.2,0.4,0.9 + 0.1*Math.random());
        pFrequencies.push(0.1 + 0.1*Math.random(),0.1 + 0.1*Math.random(),0.1 + 0.1*Math.random());
    }

    var pEmitter = this.pEmitter = this.pParticleManager.createEmitter(a.EMITTER.OBJECT,nParticles);


    pEmitter.setParticleData([VE_VEC3('PARTICLE_POSITION')],new Float32Array(pPositions));
    pEmitter.setParticleData([VE_VEC3('PARTICLE_VELOCITY')],new Float32Array(pVelocities));
    pEmitter.setParticleData([VE_FLOAT('LIVE_TIME')],new Float32Array(pLiveTimes));
    pEmitter.setParticleData([VE_VEC3('PARTICLE_COLOUR')],new Float32Array(pColours));
    pEmitter.setParticleData([VE_VEC3('PARTICLE_FREQUENCY')],new Float32Array(pFrequencies));
    
    // 
    //pEmitter.setParticleData([VE_VEC3('PARTICLE_POSITION')],new Float32Array([0,0,0]));
    //pEmitter.setParticleData([VE_VEC3('PARTICLE_VELOCITY')],new Float32Array([1,3,0]));

    var iPosition = pEmitter.setObjectData([VE_VEC3('POSITION')],pEmitterObject.vertices);
    var iNormal = pEmitter.setObjectData([VE_VEC3('NORMAL')],pEmitterObject.normals);
    pEmitter.setObjectIndex([VE_FLOAT('INDEX_POSITION')],pEmitterObject.INDEX_POSITION);
    pEmitter.setObjectIndex([VE_FLOAT('INDEX_NORMAL')],pEmitterObject.INDEX_NORMAL);
    pEmitter.objectIndex(iPosition,'INDEX_POSITION');
    pEmitter.objectIndex(iNormal,'INDEX_NORMAL');

    pEmitter.setLiveTime(Number.POSITIVE_INFINITY);

    pEmitter.updateRoutine = updateRoutine;
    pEmitter.drawRoutine = drawRoutine;

    pEmitter.attachToParent(this.getRootNode());
    pEmitter.create();

    pEmitter.setProgram(this.pUpdateVelocityProg);
    pEmitter.setProgram(this.pUpdatePositionProg);
    pEmitter.setProgram(this.pParticleShowProg);

    pEmitter.activate();
    trace(this.pEmitter);

    var pCamera = this.getActiveCamera();
    pCamera.addRelPosition(-8.0, 5.0, 11.0);
    pCamera.addRelRotation(-3.14/5, -3.14/15, 0);

    window.pParticleDemo = this;


    this.pDevice.setRenderState(a.renderStateType.SRCBLEND, a.BLEND.SRCALPHA);
    this.pDevice.setRenderState(a.renderStateType.DESTBLEND, a.BLEND.INVSRCALPHA);

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
    this.pDevice.disableVertexAttribArray(2);

    draw(this.pDrawPlaneProg, this.pPlane, false);
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

function simpleTorus (rings, sides) {
    rings = rings || 50;
    sides = sides || 50;

    var vertices  = [];
    var normals   = [];
    var tex       = [];
    var ind       = [];
    var r1        = 0.3;
    var r2        = 1.5;
    var ringDelta = 2.0 * 3.1415926 / rings;
    var sideDelta = 2.0 * 3.1415926 / sides;
    var invRings  = 1.0 / rings;
    var invSides  = 1.0 / sides;
    var index       = 0;
    var numVertices = 0;
    var numFaces    = 0;
    var i, j;

    for ( i = 0; i <= rings; i++ ) {
        var theta    = i * ringDelta;
        var cosTheta = Math.cos ( theta );
        var sinTheta = Math.sin ( theta );

        for ( j = 0; j <= sides; j++ ) {
            var phi    = j * sideDelta;
            var cosPhi = Math.cos ( phi );
            var sinPhi = Math.sin ( phi );
            var dist   = r2 + r1 * cosPhi;

            vertices.push ( cosTheta * dist);
            vertices.push ( -sinTheta * dist);
            vertices.push ( r1 * sinPhi );
            
            tex.push     ( j * invSides );
            tex.push     ( i * invRings );
            
            normals.push ( cosTheta * cosPhi );
            normals.push ( -sinTheta * cosPhi );
            normals.push ( sinPhi );

            numVertices++;
        }
    }
    
    for ( i = 0; i < rings; i++ ) {
        for ( j = 0; j < sides; j++ ) {
            ind.push ( i*(sides+1) + j );
            ind.push ( (i+1)*(sides+1) + j );
            ind.push ( (i+1)*(sides+1) + j + 1 );
            
            ind.push ( i*(sides+1) + j );
            ind.push ( (i+1)*(sides+1) + j + 1 );
            ind.push ( i*(sides+1) + j + 1 );
            
            numFaces += 2;
        }
    }

    var pMesh, pSubMesh;
    var pMaterial;
    var iPos, iNorm;

    return {'vertices' :  new Float32Array(vertices),'normals' :  new Float32Array(normals),
    'INDEX_POSITION' : new Float32Array(ind),'INDEX_NORMAL' : new Float32Array(ind)};
};

function updateRoutine(dt,t,nStep,pProgram,sPass){
    var pParticleDemo = window.pParticleDemo;
    if(sPass == 'velocity'){
        pParticleDemo.pDevice.enableVertexAttribArray(0);
        pParticleDemo.pDevice.disableVertexAttribArray(1);
        pParticleDemo.pDevice.disableVertexAttribArray(2);
        pProgram.applyFloat('dt',dt);
        pProgram.applyFloat('t',t);
        pProgram.applyVector3('v3fRand',new Float32Array([10.*(Math.random()-0.5),10.*(Math.random()-0.5),10.*(Math.random()-0.5)]));
    }
    else if(sPass == 'position'){
        //pParticleDemo.pDevice.enableVertexAttribArray(1);
        pProgram.applyFloat('dt',dt);
        pProgram.applyFloat('t',t);
    }
}

function drawRoutine(dt,t,nStep,pProgram,sPass){

    var pParticleDemo = window.pParticleDemo;
    var pEmitter = pParticleDemo.pEmitter;
    var pCamera = pParticleDemo._pDefaultCamera;

    // pParticleDemo.pDevice.setRenderState(a.renderStateType.SRCBLEND, a.BLEND.SRCALPHA);
    // pParticleDemo.pDevice.setRenderState(a.renderStateType.DESTBLEND, a.BLEND.INVSRCALPHA);

    pProgram.applyMatrix4('model_mat', pEmitter.worldMatrix());
    pProgram.applyMatrix4('proj_mat', pCamera.projectionMatrix());
    pProgram.applyMatrix4('view_mat', pCamera.viewMatrix());
    pProgram.applyFloat('t',t);

    pParticleDemo.pDevice.enableVertexAttribArray(0);
    pParticleDemo.pDevice.enableVertexAttribArray(1);
    pParticleDemo.pDevice.enableVertexAttribArray(2);
    //pParticleDemo.pDevice.enableVertexAttribArray(3);
};

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