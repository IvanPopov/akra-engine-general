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
    this.shaderManager().loadEffectFile('http://akra/akra-engine-general/media/effects/Simple_effect.fx');
//    this.shaderManager().loadEffectFile('http://akra/akra-engine-general/media/effects/Demo_simple.fx');

    function addMeshToScene(pEngine, pMesh, pParent) {
        var pSceneObject = new a.SceneModel(pEngine, pMesh);
//        pSceneObject.create();
//        pSceneObject.attachToParent(pParent || pEngine.getRootNode());
        return pSceneObject;
    }

    this.pPlane = addMeshToScene(this, sceneSurface(this));
    this.pPlane.bNoRender = true;
    var pSnapshot = this.pPlane._pMeshes[0][0]._pActiveSnapshot;
    var pData = this.pPlane._pMeshes[0][0]._pRenderData;
    var pEffectResource = pSnapshot._pRenderMethod._pEffect;
    var time = new Date();

    pEffectResource.use(this.shaderManager().getComponentByName("akra.base.simple"));
    pSnapshot.begin();
    pSnapshot.activatePass(0);
    pSnapshot.setParameter("col", [0.3,0.4,0.5]);
    pData.applyMe();
    pSnapshot.renderPass();
    pSnapshot.deactivatePass();
    pSnapshot.end();

    time = new Date() - time;

    console.log(pData, this.shaderManager(), time);

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