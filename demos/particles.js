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
        pSceneObject.addRelPosition(-3, 2.0, 0);
        return pSceneObject;
    }

    //this.pCube = addMeshToScene(this, cube(this));
    //this.pTorus = addMeshToScene(this, torus(this));
    this.pPlane = addMeshToScene(this, plane(this));

    this.pPlane.addRelPosition(0, -2.0, 0);
    this.pPlane.setScale(100.0);

    this.pDrawMeshProg = a.loadProgram(this, '../effects/mesh.glsl');
    this.pDrawPlaneProg = a.loadProgram(this, '../effects/plane.glsl');
    this.pParticleShowProg = a.loadProgram(this,'../effects/particle_show.glsl');
    this.pUpdateVelocityProg = a.loadProgram(this,'../effects/particle_update_velocity.glsl');
    this.pUpdatePositionProg = a.loadProgram(this,'../effects/particle_update_position.glsl');
    
    //this.pDrawMeshI2IProg = a.loadProgram(this, '../effects/mesh_ai.glsl');

    var pSimpleTorus = simpleTorus(25,25);

    this.pParticleManager = new a.ParticleManager(this);

    //trace(this.pParticleManager);
    var pEmitter = this.pEmitter = this.pParticleManager.createEmitter(a.EMITTER.OBJECT,5);
    pEmitter.setParticleData([VE_VEC3('PARTICLE_POSITION')],new Float32Array([0,0,0,5,0,-5,5,0,5,-5,0,5,-5,0,-5]));
    pEmitter.setParticleData([VE_VEC3('PARTICLE_VELOCITY')],new Float32Array([10,50,0,5,10,0,0,0,0,0,0,0,0,0,0]));
    // 
    //pEmitter.setParticleData([VE_VEC3('PARTICLE_POSITION')],new Float32Array([10,0,10]));
    //pEmitter.setParticleData([VE_VEC3('PARTICLE_VELOCITY')],new Float32Array([10,50,0]));

    var iPosition = pEmitter.setObjectData([VE_VEC3('POSITION')],pSimpleTorus.vertices);
    var iNormal = pEmitter.setObjectData([VE_VEC3('NORMAL')],pSimpleTorus.normals);
    pEmitter.setObjectIndex([VE_FLOAT('INDEX_POSITION')],pSimpleTorus.INDEX_POSITION);
    pEmitter.setObjectIndex([VE_FLOAT('INDEX_NORMAL')],pSimpleTorus.INDEX_NORMAL);
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
        
        if (hasMat) {
            pProgram.applyMatrix3('normal_mat', pModel.normalMatrix());
            pProgram.applyVector3('eye_pos', pCamera.worldPosition());
        }

        pModel.findMesh().draw();
    }    

    // this.pDrawMeshProg.activate();
    // this.pDevice.enableVertexAttribArray(0);
    // this.pDevice.enableVertexAttribArray(1);
    // this.pDevice.enableVertexAttribArray(2);

    //this.pTorus.addRelRotation(0.01, 0., -0.01);        
    //this.pCube.addRelRotation(-0.01, 0.01, 0.);
    
    //draw(this.pDrawMeshProg, this.pCube);
    //draw(this.pDrawMeshProg, this.pTorus);



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
    }
    else if(sPass == 'position'){
        pParticleDemo.pDevice.enableVertexAttribArray(1);
        pProgram.applyFloat('dt',dt);
    }
}

function drawRoutine(dt,t,nStep,pProgram,sPass){

    var pParticleDemo = window.pParticleDemo;
    var pEmitter = pParticleDemo.pEmitter;
    var pCamera = pParticleDemo._pDefaultCamera;

    pProgram.applyMatrix4('model_mat', pEmitter.worldMatrix());
    pProgram.applyMatrix4('proj_mat', pCamera.projectionMatrix());
    pProgram.applyMatrix4('view_mat', pCamera.viewMatrix());

    pParticleDemo.pDevice.enableVertexAttribArray(0);
    pParticleDemo.pDevice.enableVertexAttribArray(1);
    pParticleDemo.pDevice.enableVertexAttribArray(2);
    //pParticleDemo.pDevice.enableVertexAttribArray(3);
}