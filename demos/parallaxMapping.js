Include('geom.js')

function ParallaxMapping() {
    A_CLASS;
};

EXTENDS(ParallaxMapping, a.Engine);

ParallaxMapping.prototype.oneTimeSceneInit = function () {
    'use strict';
    
    this.notifyOneTimeSceneInit();
    this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0.0, 500.0));
    this.showStats(true);

    this.pHeightTexture = this.displayManager().texturePool()
        .loadResource('../../../../akra-engine-general/media/textures/lion-bump.png');

    return true;
}; 

ParallaxMapping.prototype.restoreDeviceObjects = function () {
    this.notifyRestoreDeviceObjects();
    return true;
};


ParallaxMapping.prototype.initDeviceObjects = function () {
    this.notifyInitDeviceObjects();

    var me = this;
    var pShaderSource;
    var pProgram;


    function addMeshToScene(pEngine, pMesh) {
        var pSceneObject = new a.SceneModel(pEngine, pMesh);
        pSceneObject.create();
		pSceneObject.attachToParent(pEngine.getRootNode());
        return pSceneObject;
    }

    this.appendMesh = function (pMesh, pNode) {
        return addMeshToScene(me, pMesh, pNode);
    }
    this.pCubeMesh = cube(this);

    this.pLightPoint = this.appendMesh(this.pCubeMesh);
    
    this.pPlane = addMeshToScene(this, sceneSurface(this));
    this.pPlane.bNoRender = true;
    this.pPlane.setScale(200.0);

    this.pDrawMeshProg = a.loadProgram(this, '../effects/mesh.glsl');
    this.pDrawPlaneProg = a.loadProgram(this, '../effects/plane.glsl');
    this.pPerlinProg = a.loadProgram(this,'../effects/perlin_noise.glsl');
    this.pGenerateNormalProg = a.loadProgram(this,'../effects/generate_normal_map.glsl');
    this.pParallaxProg = a.loadProgram(this,'../effects/parallaxMapping.glsl');


    this.pBaseTexture = this.displayManager().texturePool()
    .loadResource('../../../../akra-engine-general/media/textures/lion.png');
    // this.pBaseTexture = this.displayManager().texturePool()
    // .loadResource('../../../../akra-engine-general/media/textures/brick_t.png');
    // this.pBaseTexture = this.displayManager().texturePool()
    //     .loadResource('../../../../akra-engine-general/media/textures/sand_dark.dds');
    // this.pBaseTexture = this.displayManager().texturePool()
    //     .loadResource('../../../../akra-engine-general/media/textures/brick_texture_133.png');


    //this.pBaseTexture.(); 

    this.fScale = 0.01;

    // this.pHeightTexture = this.displayManager().texturePool()
    //     .loadResource('../../../../akra-engine-general/media/textures/lion-bump.png');

    // this.pHeightTexture = this.displayManager().texturePool()
    //     .loadResource('../../../../akra-engine-general/media/textures/brick_h_gs.png');
    // this.pHeightTexture = this.displayManager().texturePool()
    //     .loadResource('../../../../akra-engine-general/media/textures/BrickModernLarge01_h.png');
    // this.pHeightTexture = this.displayManager().texturePool()
    //     .loadResource('../../../../akra-engine-general/media/textures/brick_heigth_172.png');
    //this.pHeightTexture = computePerlinNoiseGPU(this,1024,1024,0.01,5,0.3);
    // this.pNormalTexture = this.displayManager().texturePool()
    //     .loadResource('../../../../akra-engine-general/media/textures/brick_n.png');
    // this.pNormalTexture = this.displayManager().texturePool()
    //     .loadResource('../../../../akra-engine-general/media/textures/BrickModernLarge01_n_test.png');
    this.pNormalTexture = computeNormalMapGPU(this,this.pHeightTexture,this.fScale,0);

    var pSprite = new a.Sprite(this);
    pSprite.setGeometry(30,30);
    pSprite.setData([VE_VEC3('COLOR')],new Float32Array([1,0,0,0,0,1,0,0,1,0,1,0]));
    pSprite.setData([VE_VEC2('TEXTURE_POSITION')],new Float32Array([0,0,0,1,1,0,1,1]));
    pSprite.centerPosition = Vec3.create(0,15,0);
    pSprite.drawRoutine = spriteDraw;
    pSprite.setProgram(this.pParallaxProg);

    this.pSprite = pSprite;
    pSprite.create();
    pSprite.attachToParent(this.getRootNode());
    pSprite.visible = true;

    var pCamera = this.getActiveCamera();
    pCamera.addRelPosition(-8.0, 5.0, 11.0);
    pCamera.addRelRotation(-3.14/5, -3.14/15, 0);
    window.pParallaxMapping = this;

    return true;
};
ParallaxMapping.prototype.directRender = function() {
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
    draw(this.pDrawPlaneProg, this.pPlane, false);
};

ParallaxMapping.prototype.deleteDeviceObjects = function () {
    this.notifyDeleteDeviceObjects();
    return true;
};

ParallaxMapping.prototype.updateScene = function () {
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
    var App = new ParallaxMapping();
    if (!App.create('canvas') || !App.run()) {
        alert('something wrong....');
    }
}

function spriteDraw(pProgram){
    'use strict';
    var pEngine = window.pParallaxMapping;
    var pCamera = pEngine._pDefaultCamera;
    var pSprite = pEngine.pSprite;
    pProgram.applyMatrix4('model_mat', pSprite.worldMatrix());
    pProgram.applyMatrix4('proj_mat', pCamera.projectionMatrix());
    pProgram.applyMatrix4('view_mat', pCamera.viewMatrix());
    pProgram.applyVector3('eye_pos', pCamera.worldPosition());

    pProgram.applyFloat('fBumpScale',pEngine.fScale);

    pEngine.pHeightTexture.activate(1);
    pProgram.applyInt('heightTexture',1);

    pEngine.pNormalTexture.activate(2);
    pProgram.applyInt('normalTexture',2);

    pEngine.pBaseTexture.activate(3);
    pProgram.applyInt('baseTexture',3);

    pProgram.applyInt('iLevels',20);

    var w = 0.0001;
    var time = a.now();
    pEngine.pLightPoint.setPosition(25.*Math.sin(w*time), 15.,15.*Math.cos(w*time));
    //pEngine.pLightPoint.setPosition(20., 15.,10.);

    pProgram.applyVector3('light_position',
        pEngine.pLightPoint.getPosition());
};

function computePerlinNoiseGPU(pEngine,iSizeX,iSizeY,fScale,iOctaves,fFalloff){

    var pProgram = pEngine.pPerlinProg;
    pProgram.activate();

    var pDevice = pEngine.pDevice;

    var iTableSize = iSizeX + iSizeY;
    var fStep = 2*Math.PI / iTableSize;
    
    var iTmp = Math.ceilingPowerOfTwo(iTableSize);
    iTmp = Math.log(iTmp)/Math.log(2);
    var intermediateTextureSizeX = Math.pow(2,Math.ceil(iTmp/2));
    var intermediateTextureSizeY = Math.pow(2,Math.floor(iTmp/2));
    
    var nTmp = intermediateTextureSizeX*intermediateTextureSizeY;
    
    var pRandomData = new Uint8Array(4*nTmp);
    
    for (var i=0; i < iTableSize; i++){
        var iRand = Math.floor(Math.random()*(iTableSize-1));
        pRandomData[4*i + 0] =iRand >>> 24;
        pRandomData[4*i + 1] =(iRand >>> 16) & 255;
        pRandomData[4*i + 2] =(iRand >>> 8) & 255;
        pRandomData[4*i + 3] = iRand & 255;
    }

    var pRandomTexture = pEngine.displayManager().texturePool().
                                    findResource('intermediateNoise');
    if(pRandomTexture == null){
        pRandomTexture = pEngine.displayManager().texturePool().
                                    createResource('intermediateNoise');
    }
    pRandomTexture.createTexture(intermediateTextureSizeX,intermediateTextureSizeY,0,
        a.IFORMAT.RGBA8,a.ITYPE.UNSIGNED_BYTE,pRandomData);

    pRandomTexture.applyParameter(a.TPARAM.MAG_FILTER, a.TFILTER.NEAREST);
    pRandomTexture.applyParameter(a.TPARAM.MIN_FILTER, a.TFILTER.NEAREST);

    var pTexturePerlin = pEngine.displayManager().texturePool().createResource('perlinNose' + a.now());
    pTexturePerlin.createTexture(iSizeX,iSizeY,0,
        a.IFORMAT.RGBA8,a.ITYPE.UNSIGNED_BYTE,null);

    var pPerlinFrameBuffer = pTexturePerlin._pFrameBuffer;
    pDevice.bindFramebuffer(pDevice.FRAMEBUFFER, pPerlinFrameBuffer);
    pDevice.framebufferTexture2D(pDevice.FRAMEBUFFER, pDevice.COLOR_ATTACHMENT0,
        pDevice.TEXTURE_2D, pTexturePerlin.texture, 0);
    //pDevice.bindFramebuffer(pDevice.FRAMEBUFFER, null);
    
    var pBuffer = pEngine.displayManager().vertexBufferPool().findResource('perlin noise attribute');
    if(pBuffer == null){
        pBuffer = pEngine.displayManager().vertexBufferPool().createResource('perlin noise attribute');
        pBuffer.create(32,0,new Float32Array([-1,-1,-1,1,1,-1,1,1]));
    }

    var pBufferMap = new a.BufferMap(pEngine);
    pBufferMap.primType = a.PRIMTYPE.TRIANGLESTRIP;
    pBufferMap.flow(0,pBuffer.getVertexData(0,4,[VE_VEC2('POSITION')]));
    //trace(pBufferMap.toString());

    pRandomTexture.activate(0);

    pProgram.applyInt('intermediateTexture',0);
    pProgram.applyInt('iOctaves',iOctaves);
    pProgram.applyFloat('fStep',fStep);
    pProgram.applyFloat('fScale',fScale);
    pProgram.applyFloat('fFalloff',fFalloff);
    pProgram.applyVector2('v2fNoiseSize',iSizeX,iSizeY);
    pProgram.applyVector3('v3fIntermediateTextureSize',
            intermediateTextureSizeX,intermediateTextureSizeY,iSizeX + iSizeY);

    pProgram.applyBufferMap(pBufferMap);
    pDevice.viewport(0,0,iSizeX,iSizeY);

    pBufferMap.draw();
    pDevice.bindFramebuffer(pDevice.FRAMEBUFFER, null);

    return pTexturePerlin;
};

function computeNormalMapGPU(pEngine,pHeightTexture,fScale,iChannel){

    iChannel = ifndef(iChannel,0);

    var pProgram = pEngine.pGenerateNormalProg;
    pProgram.activate();

    var pDevice = pEngine.pDevice;

    var pNormalTexture = pEngine.displayManager().texturePool().
        createResource('normalTexture' + a.now());

    var iSizeX = pHeightTexture.width;
    var iSizeY = pHeightTexture.height;

    pNormalTexture.createTexture(iSizeX,iSizeY,0,
        a.IFORMAT.RGBA8,a.ITYPE.UNSIGNED_BYTE,null);

    var pNormalFrameBuffer = pNormalTexture._pFrameBuffer;
    pDevice.bindFramebuffer(pDevice.FRAMEBUFFER, pNormalFrameBuffer);
    pDevice.framebufferTexture2D(pDevice.FRAMEBUFFER, pDevice.COLOR_ATTACHMENT0,
        pDevice.TEXTURE_2D, pNormalTexture.texture, 0);

    var pBuffer = pEngine.displayManager().vertexBufferPool().findResource('normal map attribute');
    if(pBuffer == null){
        pBuffer = pEngine.displayManager().vertexBufferPool().createResource('normal map attribute');
        pBuffer.create(32,0,new Float32Array([-1,-1,-1,1,1,-1,1,1]));
    }

    var pBufferMap = new a.BufferMap(pEngine);
    pBufferMap.primType = a.PRIMTYPE.TRIANGLESTRIP;
    pBufferMap.flow(0,pBuffer.getVertexData(0,4,[VE_VEC2('POSITION')]));

    pHeightTexture.activate(0);

    pProgram.applyInt('heightTexture',0);
    pProgram.applyInt('iChannel',iChannel);
    pProgram.applyFloat('fScale',fScale);
    pProgram.applyVector2('fSteps',1/iSizeX,1/iSizeY);

    pProgram.applyBufferMap(pBufferMap);

    pDevice.viewport(0,0,iSizeX,iSizeY);

    pBufferMap.draw();
    pDevice.bindFramebuffer(pDevice.FRAMEBUFFER, null);

    return pNormalTexture;
};
