Include("geom.js")

function ShaderDemo() {
    A_CLASS;
    this.pPlane = null;
    this.pCube = null;
    this.pTexture0 = null;
    this.pEntry = null;
    STATIC(fMoveSpeed, 1.);
}
;

EXTENDS(ShaderDemo, a.Engine);

ShaderDemo.prototype.oneTimeSceneInit = function () {
    'use strict';
    this.notifyOneTimeSceneInit();
    this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0.0, 500.0));
    this.showStats(true);
//    A_TRACER.BEGIN();
    this.pTexture0 = this.displayManager().texturePool().loadResource("/akra-engine-general/media/textures/lion.png");
    return true;
};

ShaderDemo.prototype.restoreDeviceObjects = function () {
    this.notifyRestoreDeviceObjects();
    return true;
};


ShaderDemo.prototype.initDeviceObjects = function () {
//    A_TRACER.END();
    this.notifyInitDeviceObjects();
    var pManager = this.shaderManager();
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/SystemEffects.afx');
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/Plane.afx');
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/mesh.afx');
//    pManager.loadEffectFile('http://akra/akra-engine-general/effects/mesh2.afx');
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/mesh_geometry.afx');
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/mesh_texture.afx');
    pManager.loadEffectFile('http://akra/akra-engine-general/effects/samplers_array.afx');

    var pEffectResource;
    var time;
    var pSurface, pMat;
    time = new Date();
    function addMeshToScene(pEngine, pMesh, pParent) {
        var pSceneObject = new a.SceneModel(pEngine, pMesh);
        pSceneObject.create();
        pSceneObject.attachToParent(pParent || pEngine.getRootNode());
        return pSceneObject;
    }

    this.pPlane = addMeshToScene(this, sceneSurface(this));
    this.pPlane.bNoRender = true;
    this.pPlane.setScale(200.0);
    pEffectResource = this.pPlane._pMeshes[0][0]._pActiveSnapshot._pRenderMethod._pEffect;
    pEffectResource.create();
    pEffectResource.use(this.shaderManager().getComponentByName("akra.system.plane"));

    this.pCube = new Array(1);
    for (var i = 0; i < this.pCube.length; i++) {
        this.pCube[i] = addMeshToScene(this, cube(this));
        this.pCube[i].bNoRender = true;
        pEffectResource = this.pCube[i]._pMeshes[0][0]._pActiveSnapshot._pRenderMethod._pEffect;
        pEffectResource.create();
//        pEffectResource.use(this.shaderManager().getComponentByName("akra.system.mesh_geometry"));
        pEffectResource.use(this.shaderManager().getComponentByName("akra.system.mesh_texture"));

        pSurface = this.pCube[i]._pMeshes[0][0].surfaceMaterial;
        pMat = pSurface.material;
        pMat.pDiffuse = new a.Color4f(0.1, 0., 0., 1.);
        pMat.pAmbient = new a.Color4f(0.1, 0., 0., 1.);
        pMat.pSpecular = new a.Color4f(1., 0.7, 0., 1);
        pMat.pShininess = 30.;
        pSurface.setTexture(1, this.pTexture0, 2);
    }

//    trace("PLANE: ", pEntry1);
//    trace("CUBE: ", pEntry2);
//    for(var i = 0; i < pEntry.length; i++){
//        pManager.render(pEntry[i]);
//    }

//    A_TRACER.END();
    this.pause(true);
    this.notifyInitDeviceObjects();
    return true;
};

ShaderDemo.prototype.directRender = function () {
    'use strict';
//    var pManager = this.shaderManager();
//
//     //    A_TRACER.BEGIN();
//     var pManager = this.shaderManager();
//     var pSnapshot;
//     var pMap;
//     var pEntry = [];
//     //PLANE
//     window['A_TRACER.trace']('before PLANE');
//     pSnapshot = this.pPlane._pMeshes[0][0]._pActiveSnapshot;
//     pMap = this.pPlane._pMeshes[0][0]._pRenderData._pMap;
//     pSnapshot.begin();
//     pSnapshot.activatePass(0);
//     pManager.setViewport(0, 0, this.pCanvas.width, this.pCanvas.height);
//     pSnapshot.setParameter("model_mat", [
//     200, 0, 0, 0,
//     0, 200, 0, 0,
//     0, 0, 200, 0,
//     0, 0, 0, 1]);
//     pSnapshot.applyBufferMap(pMap);
//     pEntry.push(pSnapshot.renderPass());
//     pSnapshot.deactivatePass();
//     pSnapshot.end();
//     //    pManager.render(pEntry1);
//     //CUBE
//     window['A_TRACER.trace']('before CUBE');
//     for (var i = 0; i < this.pCube.length; i++) {
//     pSnapshot = this.pCube[i]._pMeshes[0][0]._pActiveSnapshot;
//     //    trace("CUBE surface:", pSnapshot.surfaceMaterial);
//     pMap = this.pCube[i]._pMeshes[0][0]._pRenderData._pMap;
//     pSnapshot.begin();
//     pSnapshot.activatePass(0);
//     pManager.setViewport(0, 0, this.pCanvas.width, this.pCanvas.height);
//     pSnapshot.setParameter("model_mat", [
//     1, 0, 0, 0,
//     0, 1, 0, 0,
//     0, 0, 1, 0,
//     0, 0, 0, 1]);
//     pSnapshot.setParameter("normal_mat", [
//     1, 0, 0,
//     0, 1, 0,
//     0, 0, 1]);
//     //    pSnapshot.setParameter("test_uniform", {a : 1.0, b : {x : 0.5, y : 0.3}});
//     //    pSnapshot.setParameter("test_uniform.b.x", 0.1);
//     //    pSnapshot.setParameter("UTEST0", {TA : 0.7, TB : {TX : 0.7, TY : 0.8}}, true);
//     //    pSnapshot.setParameterBySemantic("UTEST0.TB.TX", 0.4);
//     pSnapshot.applyBufferMap(pMap);
//     pSnapshot.applySurfaceMaterial();
//     pEntry.push(pSnapshot.renderPass());
//     pSnapshot.deactivatePass();
//     pSnapshot.end();
//     }
//     //    pManager.render(pEntry2);
//
//     window['A_TRACER.trace']('before RENDER');
//     //    trace("PLANE: ", pEntry1);
//     //    trace("CUBE: ", pEntry2);
//     for(var i = 0; i < pEntry.length; i++){
//        pManager.render(pEntry[i]);
//     }
//     //    pManager.render(pEntry1);
//     //    pManager.render(pEntry2);
//
//     //    this.pause(true);
//     //    A_TRACER.END();*/
////    for (var i = 0; i < this.pEntry.length; i++) {
////        pManager.render(this.pEntry[i]);
////    }
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