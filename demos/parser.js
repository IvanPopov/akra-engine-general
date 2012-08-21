Include("geom.js")

function ShaderDemo() {
    A_CLASS;
    this.pPlane = null;
    this.pEntry = null;
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
    A_TRACER.BEGIN();
    var pManager = this.shaderManager();
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/SystemEffects.afx');
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/Plane.afx');
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
    var pMap = this.pPlane._pMeshes[0][0]._pRenderData._pMap;
    pEffectResource = pSnapshot._pRenderMethod._pEffect;

    pEffectResource.use(this.shaderManager().getComponentByName("akra.system.plane"));
    pSnapshot.begin();
    pSnapshot.activatePass(0);
    pSnapshot.setParameter("model_mat",[
        200, 0, 0, 0,
        0, 200, 0, 0,
        0, 0, 200, 0,
        0, 0, 0, 1]);
    pSnapshot.setParameter("view_mat", [1, 0, 0, 0, 0, 0.9578262567520142, 0.2873478829860687, 0, 0, -0.2873478829860687, 0.9578262567520142, 0, 0, 2.873478889465332, -20.01856803894043, 1]);
    pSnapshot.setParameter("proj_mat", [0.8921865820884705, 0, 0, 0, 0, 1.7320507764816284, 0, 0, 0, 0, -1.0000666379928589, -1, 0, 0, -0.2000066637992859, 0]);
    pSnapshot.applyBufferMap(pMap);
    var pEntry = pSnapshot.renderPass();
    pSnapshot.deactivatePass();
    pSnapshot.end();
//
    this.pDevice.viewport(0, 0, 1200, 700);
    this.pEntry = pEntry;
    pManager.render(pEntry);
//    time = new Date() - time;
//    this.pause(true);
    console.log(this.shaderManager(), time);
    A_TRACER.END();
    this.pause(true);
    this.notifyInitDeviceObjects();
    return true;
};

ShaderDemo.prototype.directRender = function () {
    'use strict';
    //this.shaderManager().render(this.pEntry);
    //A_TRACER.END();
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