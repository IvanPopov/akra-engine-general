Include("geom.js")

function ShaderDemo() {
    A_CLASS;
    this.pPlane = null;
    this.pCube = null;
    this.pTexture0 = null;
    this.pEntry = null;
    this.pModel = null;
    this.pSprite = null;
    this.pLightPoint = null;
    STATIC(fMoveSpeed, 1.);
}

EXTENDS(ShaderDemo, a.Engine);

ShaderDemo.prototype.oneTimeSceneInit = function () {
    'use strict';
    this.notifyOneTimeSceneInit();
    this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0.0, 500.0));
    this.showStats(true);
//    A_TRACER.BEGIN();

    var pManager = this.shaderManager();
    var pSystemEffect;
    pSystemEffect = pManager.loadEffectFile('http://akra/akra-engine-general/effects/SystemEffects.afx', true);
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
//    pManager.loadEffectFile('http://akra/akra-engine-general/effects/test_complex_struct.afx', true);

    this.pTexture0 = this.displayManager().texturePool().loadResource("/akra-engine-general/media/textures/lion.png");
    this.pModel = this.displayManager().modelPool().createResource('model');
//    this.pModel.loadResource("/akra-engine-general/media/models/arm.DAE", {animation : false});
    this.pModel.loadResource("/akra-engine-general/media/models/demo3/mesh_chr/mesh_chr.DAE", {});


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


    var pLightPoint = this.pLightPoint = new a.LightPoint(this,true,true,2048);
    pLightPoint.create();
    pLightPoint.attachToParent(this.getRootNode());

    var m4fTempView = Mat4.lookAt(Vec3(3,4,0),Vec3(0.,1.,0.),Vec3(0,1,0),Mat4());

    pLightPoint.accessLocalMatrix().set(m4fTempView.inverse());
    pLightPoint.addRelRotation(Math.PI/4.,0,0);
    pLightPoint.isActive = false;
    if(!pLightPoint.isOmnidirectional) {
        pLightPoint.camera.setProjParams(Math.PI/5,1,0.01,1000);
    }

    var pLightOmni = this.pLightPoint = new a.LightPoint(this);
    pLightOmni.create();
    pLightOmni.attachToParent(this.getRootNode());
    pLightOmni.addPosition(Vec3(0.,3.,5.));
    pLightOmni.isActive = true;

    var pLightParameters = pLightPoint.lightParameters;

    pLightParameters.attenuation.set(0.9, 0.0, .000);

    function addMeshToScene(pEngine, pMesh, pParent) {
        var pSceneObject = new a.SceneModel(pEngine, pMesh);
        pSceneObject.create();
        pSceneObject.attachToParent(pParent || pEngine.getRootNode());
        return pSceneObject;
    }

    this.pPlane = addMeshToScene(this, sceneSurface(this));

    var pEffectResource = this.pPlane._pMeshes[0][0]._pActiveSnapshot._pRenderMethod._pEffect;
    pEffectResource.create();
    pEffectResource.use(this.shaderManager().getComponentByName("akra.system.plane"));

    this.pCubeMesh = cube(this);
    this.appendMesh = function (pMesh, pNode) {
        return addMeshToScene(me, pMesh, pNode);
    }

    this.pModel.addToScene();
    this.pModel.applyShadow();

    var pCamera = this.getActiveCamera();

    pCamera.addRelRotation(0, -Math.PI/6, 0);
    pCamera.addPosition(0.0, 3.0, 3.0);


//    pEffectResource = this.displayManager().effectPool().createResource(".Test_effect_resource");
//    pEffectResource.create();
//    pEffectResource.use("test_technique");
//    var pComponentBlend = this.shaderManager()._pComponentBlendsId[6];
//    pComponentBlend.finalize();

//    trace("RENDERER-------------->", this.shaderManager(), pComponentBlend);




//    A_TRACER.END();
//    this.pause(true);


    return true;
};


ShaderDemo.prototype.deleteDeviceObjects = function () {
    this.notifyDeleteDeviceObjects();
    return true;
};

ShaderDemo.prototype.updateScene = function () {
    this.updateCamera(0.25, 0.1, null, 30.0, false);

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
    var App = new ShaderDemo();
    if (!App.create('canvas') || !App.run()) {
        alert('something wrong....');
    }
}