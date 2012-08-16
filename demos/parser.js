Include("geom.js")

function ShaderDemo() {
    A_CLASS;
    this.pPlane = null;
    STATIC(fMoveSpeed, 1.);
}
;

EXTENDS(ShaderDemo, a.Engine);

ShaderDemo.prototype.oneTimeSceneInit = function () {
    'use strict';
    this.notifyOneTimeSceneInit();
    return true;
};

ShaderDemo.prototype.restoreDeviceObjects = function () {
    this.notifyRestoreDeviceObjects();
    return true;
};


ShaderDemo.prototype.initDeviceObjects = function () {
    var pManager = this.shaderManager();
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/SystemEffects.afx');
//    this.shaderManager().loadEffectFile('http://akra/akra-engine-general/media/effects/Simple_effect.fx');
    var pEffectResource;// = this.displayManager().effectPool().createResource("ABC");
    var pSnapshot;// = new RenderSnapshot();
    var pMethod;// = this.displayManager().renderMethodPool().createResource("METHOD111");
    var time;
//    pMethod.effect = pEffectResource;
//    pSnapshot.method = pMethod;
//    pEffectResource.use(this.shaderManager().getComponentByName("akra.system.update_video_buffer"));
//    pEffectResource.use(this.shaderManager().getComponentByName("akra.base.simple"));
//    pSnapshot.begin();
//    pSnapshot.activatePass(0);
////    pSnapshot.setParameter("size", 0.5);
//    pSnapshot.renderPass();
    //console.log(this.pShaderManager);
    time = new Date();
    function addMeshToScene(pEngine, pMesh, pParent) {
        var pSceneObject = new a.SceneModel(pEngine, pMesh);
//        pSceneObject.create();
//        pSceneObject.attachToParent(pParent || pEngine.getRootNode());
        return pSceneObject;
    }
//
    this.pPlane = addMeshToScene(this, sceneSurface(this));
    console.log((new Date() - time));
    this.pPlane.bNoRender = true;
    pSnapshot = this.pPlane._pMeshes[0][0]._pActiveSnapshot;
    var pData = this.pPlane._pMeshes[0][0]._pRenderData;
//    pEffectResource = pSnapshot._pRenderMethod._pEffect;
//
//
//
//    pEffectResource.use(this.shaderManager().getComponentByName("akra.base.simple"));
//    pSnapshot.begin();
//    pSnapshot.activatePass(0);
//    pSnapshot.setParameter("col", [0.3,0.4,0.5]);
//    pData.applyMe();
//    var pEntry = pSnapshot.renderPass();
//    pSnapshot.deactivatePass();
//    pSnapshot.end();
//
//    pManager.activate(pEntry);
//    time = new Date() - time;

    console.log(this.shaderManager(), time);

    this.notifyInitDeviceObjects();
    return true;
};

ShaderDemo.prototype.directRender = function () {
    'use strict';
};

ShaderDemo.prototype.deleteDeviceObjects = function () {
    this.notifyDeleteDeviceObjects();
    return true;
};

ShaderDemo.prototype.updateScene = function () {
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