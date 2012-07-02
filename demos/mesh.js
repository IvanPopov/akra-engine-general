function loadGLSLSource(sPath, sFilename) {
    var sShader = a.ajax({url: sPath + sFilename, async: false}).data;
    var fnReplacer = function (sSource, sMatch) {
        return a.ajax({url: sPath + sMatch, async: false}).data;
    }

    sShader = sShader.replace(/\#include\s+\"([\w\.]+)\"/ig, fnReplacer);
    sShader = sShader.split('//<-- split -- >');
    return {vertex: sShader[0], fragment: sShader[1]};
}

// function cube (pEngine, eOptions, sName) {
// 	sName = sName || 'cube';

//     var pMesh,
//         pSubMesh;
//     var iPos, iNorm;

//     var pVerticesData = new Float32Array([
//         -0.5, 0.5, 0.5,
//         0.5, 0.5, 0.5,
//         -0.5, -0.5, 0.5,
//         0.5, -0.5, 0.5,
//         -0.5, 0.5, -0.5,
//         0.5, 0.5, -0.5,
//         -0.5, -0.5, -0.5,
//         0.5, -0.5, -0.5
//     ]);

//     var pNormalsData = new Float32Array([
//         1.0, 0.0, 0.0,
//         -1.0, 0.0, 0.0,
//         0.0, 1.0, 0.0,
//         0.0, -1.0, 0.0,
//         0.0, 0.0, 1.0,
//         0.0, 0.0, -1.0
//     ]);

//     var pVertexIndicesData = new Float32Array([
//         0, 2, 3, 0, 3, 1,
//         0, 1, 5, 0, 5, 4,
//         6, 7, 3, 6, 3, 2,
//         0, 4, 6, 0, 6, 2,
//         3, 7, 5, 3, 5, 1,
//         5, 7, 6, 5, 6, 4
//     ]);
//     var pNormalIndicesData = new Float32Array([
//         4, 4, 4, 4, 4, 4,
//         2, 2, 2, 2, 2, 2,
//         3, 3, 3, 3, 3, 3,
//         1, 1, 1, 1, 1, 1,
//         0, 0, 0, 0, 0, 0,
//         5, 5, 5, 5, 5, 5
//     ]);

//     var iNorm, iPos;
//     pMesh = new a.Mesh(pEngine, eOptions, sName);
 
    
//     pSubMesh = pMesh.allocateSubset('cube::main');

//     //iNorm = pSubMesh.allocateData([VE_VEC3('NORMAL')], pNormalsData);
//     //iPos = pSubMesh.allocateData([VE_VEC3('POSITION')], pVerticesData);
    
//     iPos = pMesh.allocateData([VE_VEC3('POSITION')], pVerticesData);
//     iNorm = pMesh.allocateData([VE_VEC3('NORMAL')], pNormalsData);
    
//     pMesh.addMaterial('default');
    
//     pSubMesh.allocateIndex([VE_FLOAT('INDEX1')], pVertexIndicesData);
//     pSubMesh.allocateIndex([VE_FLOAT('INDEX2')], pNormalIndicesData);
       
//     pSubMesh.index(iPos, 'INDEX1');
//     pSubMesh.index(iNorm, 'INDEX2');

//     //trace('index set: 1', pSubMesh._pMap.toString());

//     pSubMesh.addIndexSet();

//     pSubMesh.allocateIndex([VE_FLOAT('INDEX3')], pVertexIndicesData);
//     pSubMesh.allocateIndex([VE_FLOAT('INDEX4')], pNormalIndicesData);

//     pSubMesh.index(iPos, 'INDEX3');
//     pSubMesh.index(iNorm, 'INDEX4');

//     //trace('index set: 2', pSubMesh._pMap.toString());

//     pSubMesh.selectIndexSet(0);
//     pMesh.setMaterial('default');
//     //trace('index set: 1', pSubMesh._pMap.toString());
//     return pMesh;
// }

function torus (pEngine, eOptions, sName, rings, sides) {
    rings = rings || 30;
    sides = sides || 30;

    var vertices  = [];
    var normals   = [];
    var tex       = [];
    var ind       = [];
    var r1        = 0.1;
    var r2        = 0.5;
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

            vertices.push ( cosTheta * dist + 1.5);
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
    pMesh = new a.Mesh(pEngine, eOptions || 0, sName || 'torus');
    pSubMesh = pMesh.allocateSubset('torus::main');

    var vertnorm = [];
    for (var i = 0; i < vertices.length; i += 3) {
        vertnorm.push(vertices[i], vertices[i + 1], vertices[i + 2]);
        vertnorm.push(normals[i], normals[i + 1], normals[i + 2]);
    }

    //iNorm = pSubMesh.allocateData([VE_VEC3('NORMAL')], new Float32Array(normals));
    //iPos = pSubMesh.allocateData([VE_VEC3('POSITION')], new Float32Array(vertices));
    iPosNorm = pSubMesh.allocateData([VE_VEC3('POSITION'), VE_VEC3('NORMAL')], 
        new Float32Array(vertnorm));

    pSubMesh.allocateIndex([VE_FLOAT('INDEX_POSITION'), VE_FLOAT('INDEX_NORMAL', 0)], 
        new Float32Array(ind));

    //pSubMesh.allocateIndex([VE_FLOAT('INDEX_POSITION')], new Float32Array(ind));
    //pSubMesh.allocateIndex([VE_FLOAT('INDEX_NORMAL')], new Float32Array(ind));

    pSubMesh.index(iPosNorm, 'INDEX_POSITION');
    pSubMesh.index(iPosNorm, 'INDEX_NORMAL');
    pSubMesh.applyFlexMaterial('blue');

    pMaterial = pSubMesh.getFlexMaterial('blue');
    pMaterial.diffuse = new a.Color4f(0.3, 0.3, 1.0, 1.0);
    return pMesh;
}

function cube (pEngine, eOptions, sName) {
    var pMesh, pSubMesh;
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

    var iNorm, iPos;

    pMesh = new a.Mesh(pEngine, eOptions || 0, sName || 'cube');
    pSubMesh = pMesh.allocateSubset('cube::main');
    iNorm = pSubMesh.allocateData([VE_VEC3('NORMAL')], pNormalsData);
    iPos = pSubMesh.allocateData([VE_VEC3('POSITION')], pVerticesData);
    pSubMesh.allocateIndex([VE_FLOAT('INDEX_POSITION')], pVertexIndicesData);
    pSubMesh.allocateIndex([VE_FLOAT('INDEX_NORMAL')], pNormalIndicesData);
    pSubMesh.index(iPos, 'INDEX_POSITION');
    pSubMesh.index(iNorm, 'INDEX_NORMAL');
    pSubMesh.applyFlexMaterial('default');

    return pMesh;
} 

function MeshDemo() {
	A_CLASS;
};

EXTENDS(MeshDemo, a.Engine);

MeshDemo.prototype.oneTimeSceneInit = function () {
	'use strict';
	
	this.notifyOneTimeSceneInit();
	this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0.0, 500.0));
    this.showStats(true);
	return true;
}; 

MeshDemo.prototype.restoreDeviceObjects = function () {
	this.notifyRestoreDeviceObjects();
	return true;
};


MeshDemo.prototype.initDeviceObjects = function () {
	this.notifyInitDeviceObjects();
	
	var pCubeMesh = cube(this);
    var pTorusMesh = torus(this);
    var pShaderSource = loadGLSLSource('../effects/', 'mesh.glsl');

    var pProgram = this.displayManager().shaderProgramPool().createResource('draw_mesh');
    pProgram.create(pShaderSource.vertex, pShaderSource.fragment, true);

    this.pCube = new a.SceneModel(this, pCubeMesh);
    this.pTorus = new a.SceneModel(this, pTorusMesh);
    this.pCube.attachToParent(this.getRootNode());
    this.pTorus.attachToParent(this.getRootNode());
    this.pCube.create();
    this.pTorus.create();

    this.pDrawMeshProg = pProgram;
	return true;
};

MeshDemo.prototype.directRender = function() {
    'use strict';

    var pProgram = this.pDrawMeshProg;
    var pCamera = this.getActiveCamera();

    function draw(pModel) {
        pModel.addRelRotation(0.01, 0., 0.);
        pProgram.activate();
        pProgram.applyMatrix4('model_mat', pModel.worldMatrix());
        pProgram.applyMatrix3('normal_mat', pModel.normalMatrix());
        pProgram.applyMatrix4('proj_mat', pCamera.projectionMatrix());
        pProgram.applyMatrix4('view_mat', pCamera.viewMatrix());
        pProgram.applyVector3('eye_pos', pCamera.worldPosition());
        pModel._pMesh.draw();
    }

    this.pCube.addRelRotation(0., 0.01, 0.);
    draw(this.pCube);
    draw(this.pTorus);
};

MeshDemo.prototype.deleteDeviceObjects = function () {
	this.notifyDeleteDeviceObjects();
	return true;
};

MeshDemo.prototype.updateScene = function () {
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
	var App = new MeshDemo();
	if (!App.create('canvas') || !App.run()) {
		alert('something wrong....');
	}
}