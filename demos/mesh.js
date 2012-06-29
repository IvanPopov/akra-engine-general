function buildCubeMesh (pEngine, eOptions, sName) {
	sName = sName || 'cube';

    var pMesh,
        pSubMesh;
    var iPos, iNorm;

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

    var iBegin = a.now(), iTime = 0;
    pMesh = new a.Mesh(pEngine, eOptions, sName);
 
    trace(++iTime, 'time: ', a.now() - iBegin, 'ms');
    //iPos = pMesh.setData([VE_VEC3('POSITION')], pVerticesData);
    //iNorm = pMesh.setData([VE_VEC3('NORMAL')], pNormalsData);
    //
    //iIPos = pMesh.setData([VE_FLOAT('INDEX1')], pVertexIndicesData);
    //iINorm = pMesh.setData([VE_FLOAT('INDEX2')], pNormalIndicesData);
    

    pSubMesh = pMesh.allocateSubset();

    trace(++iTime, 'time: ', a.now() - iBegin, 'ms');
    var iNorm = pSubMesh.allocateData([VE_VEC3('NORMAL')], pNormalsData);
    
    trace(++iTime, 'time: ', a.now() - iBegin, 'ms');
    var iPos = pSubMesh.allocateData([VE_VEC3('POSITION')], pVerticesData);
    
    trace(++iTime, 'time: ', a.now() - iBegin, 'ms');
    pMesh.addMaterial('default');
   
	
	trace(++iTime, 'time: ', a.now() - iBegin, 'ms');
    
    pSubMesh.allocateIndex([VE_FLOAT('INDEX1')], pVertexIndicesData);
    pSubMesh.allocateIndex([VE_FLOAT('INDEX2')], pNormalIndicesData);
       
    pSubMesh.setMaterial('default');

    pSubMesh.index(iPos, 'INDEX1');
    pSubMesh.index(iNorm, 'INDEX2');
	trace('mesh creation time: ', a.now() - iBegin, 'ms');
    trace(pSubMesh._pMap.toString());

    return pMesh;
}



function MyGame() {
	A_CLASS;
};

EXTENDS(MyGame, a.Engine);

MyGame.prototype.oneTimeSceneInit = function () {
	'use strict';
	
	this.notifyOneTimeSceneInit();
	this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0.0, 500.0));



	return true;
}; 

MyGame.prototype.restoreDeviceObjects = function () {
	this.notifyRestoreDeviceObjects();
	return true;
};


MyGame.prototype.initDeviceObjects = function () {
	this.notifyInitDeviceObjects();
	
	trace(buildCubeMesh(this, 0));
	trace(buildCubeMesh(this, 0, 'cube2'));

	return true;
};

MyGame.prototype.deleteDeviceObjects = function () {
	this.notifyDeleteDeviceObjects();
	return true;
};

MyGame.prototype.updateScene = function () {
	this.updateCamera(1.0, 0.1, null, 30.0, false);
	return this.notifyUpdateScene();
};

if (!a.info.support.webgl) {
	alert('Error:: Your browser does not support WebGL.');
}
else {
	var App = new MyGame();
	if (!App.create('canvas') || !App.run()) {
		alert('something wrong....');
	}
}