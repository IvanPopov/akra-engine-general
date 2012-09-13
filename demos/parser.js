Include("geom.js")

function ShaderDemo() {
    A_CLASS;
    this.pPlane = null;
    this.pCube = null;
    this.pTexture0 = null;
    this.pEntry = null;
    this.pModel = null;
    this.pSprite = null;
    STATIC(fMoveSpeed, 1.);
}

EXTENDS(ShaderDemo, a.Engine);

ShaderDemo.prototype.oneTimeSceneInit = function () {
    'use strict';
    this.notifyOneTimeSceneInit();
    this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0.0, 500.0));
    this.showStats(true);
    A_TRACER.BEGIN();

    var pManager = this.shaderManager();
    var pSystemEffect;
    pSystemEffect = pManager.loadEffectFile('http://akra/akra-engine-general/effects/SystemEffects.afx', true);
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/Plane.afx', true);
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/mesh.afx', true);
//    pManager.loadEffectFile('http://akra/akra-engine-general/effects/mesh2.afx');
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/mesh_geometry.afx', true);
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/mesh_texture.afx', true);
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/samplers_array.afx', true);
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/TextureToScreen.afx', true);

    this.pTexture0 = this.displayManager().texturePool().loadResource("/akra-engine-general/media/textures/lion.png");
    this.pModel = this.displayManager().modelPool().createResource('model');
    this.pModel.loadResource("/akra-engine-general/media/models/skeleton.DAE", {animation : false});


    this.pResourceManager.monitorInitResources(function (nLoaded, nTotal, pTarget) {
        console.log('loaded:', nLoaded / nTotal * 100, '%', pTarget.findResourceName());
    });


//    var me = this;
//    var fnTextureLoad = function (iFlagBit, iResourceFlags, isSetting) {
//        if (this.isResourceLoaded()) {
//            this.delChangesNotifyRoutine(fnTextureLoad);
//            var pPool = me.displayManager().texturePool();
//            for (var iHandleResource in pPool._pNameMap) {
//                pPool.getResource(iHandleResource)._setSystemEffect();
//            }
//        }
//    }
//    pSystemEffect.setChangesNotifyRoutine(fnTextureLoad);

    return true;
};

ShaderDemo.prototype.restoreDeviceObjects = function () {
    this.notifyRestoreDeviceObjects();
    return true;
};


ShaderDemo.prototype.initDeviceObjects = function () {

//    A_TRACER.BEGIN();
    this.notifyInitDeviceObjects();
    trace(this.pModel, '<<@@@@@@@@@@@@@@@@@');
    var pManager = this.shaderManager();
//    pManager.loadEffectFile('http://akra/akra-engine-general/effects/SystemEffects.afx');
//    pManager.loadEffectFile('http://akra/akra-engine-general/effects/Plane.afx');
//    pManager.loadEffectFile('http://akra/akra-engine-general/effects/mesh.afx');
////    pManager.loadEffectFile('http://akra/akra-engine-general/effects/mesh2.afx');
//    pManager.loadEffectFile('http://akra/akra-engine-general/effects/mesh_geometry.afx');
//    pManager.loadEffectFile('http://akra/akra-engine-general/effects/mesh_texture.afx');
//    pManager.loadEffectFile('http://akra/akra-engine-general/effects/samplers_array.afx');

    var pEffectResource;
    var time;
    var pSurface, pMat;
    var me = this;
    time = new Date();
    function addMeshToScene(pEngine, pMesh, pParent) {
        var pSceneObject = new a.SceneModel(pEngine, pMesh);
        pSceneObject.create();
        pSceneObject.attachToParent(pParent || pEngine.getRootNode());
        return pSceneObject;
    }


    this.pPlane = addMeshToScene(this, sceneSurface(this));
//    this.pPlane.bNoRender = true;
//    this.pPlane.setScale(200.0);
    pEffectResource = this.pPlane._pMeshes[0][0]._pActiveSnapshot._pRenderMethod._pEffect;
    pEffectResource.create();
    pEffectResource.use(this.shaderManager().getComponentByName("akra.system.plane"));

    this.pCubeMesh = cube(this);
    this.appendMesh = function (pMesh, pNode) {
        return addMeshToScene(me, pMesh, pNode);
    }

//    this.pCube = new Array(1);
//    for (var i = 0; i < this.pCube.length; i++) {
//        this.pCube[i] = addMeshToScene(this, cube(this));
//        this.pCube[i].bNoRender = true;
//        pEffectResource = this.pCube[i]._pMeshes[0][0]._pActiveSnapshot._pRenderMethod._pEffect;
//        pEffectResource.create();
////        pEffectResource.use(this.shaderManager().getComponentByName("akra.system.mesh_geometry"));
//        pEffectResource.use(this.shaderManager().getComponentByName("akra.system.mesh_texture"));
//
//        pSurface = this.pCube[i]._pMeshes[0][0].surfaceMaterial;
//        pMat = pSurface.material;
//        pMat.pDiffuse = new a.Color4f(0.1, 0., 0., 1.);
//        pMat.pAmbient = new a.Color4f(0.1, 0., 0., 1.);
//        pMat.pSpecular = new a.Color4f(1., 0.7, 0., 1);
//        pMat.pShininess = 30.;
//        pSurface.setTexture(1, this.pTexture0, 2);
//    }
//    this.updateScene();
//    this.pPlane.render();
//    this.pCube[0].render();
//    window['A_TRACER.trace']('Real render of sceneobjects');
//    this.shaderManager().processRenderQueue();

//    trace("PLANE: ", pEntry1);
//    trace("CUBE: ", pEntry2);
//    for(var i = 0; i < pEntry.length; i++){
//        pManager.render(pEntry[i]);
//    }

//    A_TRACER.END();
    this.pSprite = screenSprite(this);
    var pSubMesh = this.pSprite[0];

    this.pModel.addToScene();

    pEffectResource = pSubMesh._pActiveSnapshot._pRenderMethod._pEffect;
    pEffectResource.create();
    pEffectResource.use("akra.system.texture_to_screen");

    this.shaderManager().setViewport(0, 0, this.pCanvas.width, this.pCanvas.height);
    pSubMesh.startRender();
    for (k = 0; k < pSubMesh.totalPasses(); k++) {
        pSubMesh.activatePass(k);
        pSubMesh.applyRenderData(pSubMesh.data);
        trace(this.pModel, this.pModel._pMeshList[0][0].data.buffer.buffer);
        pSubMesh._pActiveSnapshot.applyTextureBySemantic("TEXTURE0", this.pModel._pMeshList[1][1].data.buffer.buffer);
        pEntry = pSubMesh.renderPass();
//        trace("SceneModel.prototype.render", this, pSubMesh.renderPass().pUniforms);
        pSubMesh.deactivatePass();
    }
    pSubMesh.finishRender();

    this.shaderManager().processRenderQueue();


    trace(this.displayManager().texturePool());







    var pCamera = this.getActiveCamera();

    pCamera.addRelRotation(-3.14 / 5, 0, 0);
    pCamera.addRelPosition(-8.0, 5.0, 11.0);


    A_TRACER.END();
    this.pause(true);


    return true;
};


ShaderDemo.prototype.deleteDeviceObjects = function () {
    this.notifyDeleteDeviceObjects();
    return true;
};

ShaderDemo.prototype.updateScene = function () {
    this.updateCamera(1.0, 0.1, null, 30.0, false);

    if (this.pKeymap.isMousePress() && this.pKeymap.isMouseMoved()) {
        var pCamera = this.getActiveCamera(),
            fdX = this.pKeymap.mouseShitfX(),
            fdY = this.pKeymap.mouseShitfY(),
            pScreen = a.info.screen;

        fdX /= pScreen.width / 10.0;
        fdY /= pScreen.height / 10.0;

        pCamera.addRelRotation(fdX, fdY, 0);
    }
    return this.notifyUpdateScene();
};


if (!a.info.support.webgl) {
    alert('Error:: Your browser does not support WebGL.');
}
else {
    var App = new ShaderDemo();
    if (!App.create('canvas') || !App.run()) {
        alert('something wrong....');
    }
}