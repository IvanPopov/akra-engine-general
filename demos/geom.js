function torus (pEngine, eOptions, sName, rings, sides) {
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

    pMesh = new a.Mesh(pEngine, eOptions || a.Mesh.VB_READABLE, sName || 'torus');
    pSubMesh = pMesh.createSubset('torus::main');

    var vertnorm = [];
    for (var i = 0; i < vertices.length; i += 3) {
        vertnorm.push(vertices[i], vertices[i + 1], vertices[i + 2]);
        vertnorm.push(normals[i], normals[i + 1], normals[i + 2]);
    }

    iNorm = pSubMesh.data.allocateData([VE_VEC3('NORMAL')], new Float32Array(normals));
    iPos = pSubMesh.data.allocateData([VE_VEC3('POSITION')], new Float32Array(vertices));
    // iPosNorm = pSubMesh.data.allocateData([VE_VEC3('POSITION'), VE_VEC3('NORMAL')], 
    //     new Float32Array(vertnorm));

    // pSubMesh.data.allocateIndex([VE_FLOAT('INDEX_POSITION'), VE_FLOAT('INDEX_NORMAL', 0)], 
    //     new Float32Array(ind));

    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX_POSITION')], new Float32Array(ind));
    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX_NORMAL')], new Float32Array(ind));

    //pSubMesh.data.index(iPosNorm, 'INDEX_POSITION');
    pSubMesh.data.index(iPos, 'INDEX_POSITION');
    pSubMesh.data.index(iNorm, 'INDEX_NORMAL');
    pSubMesh.applyFlexMaterial('blue');

    pMaterial = pSubMesh.getFlexMaterial('blue');
    pMaterial.diffuse = new a.Color4f(0.3, 0.3, 1.0, 1.0);
    pMaterial.specular = new a.Color4f(1, 1, 1, 1.);
    pMaterial.shininess = 30;

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

    var pMapData = new Float32Array([
                                        0, 0, 0,
                                        1, 0, 0,
                                        0, 1, 0,
                                        1, 1, 0
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
                                                  0, 2, 3, 0, 3, 1,//front
                                                  0, 1, 5, 0, 5, 4,//top
                                                  6, 7, 3, 6, 3, 2,//bottom
                                                  0, 4, 6, 0, 6, 2,//left
                                                  3, 7, 5, 3, 5, 1,//right
                                                  5, 7, 6, 5, 6, 4 //back
                                              ]);
    var pNormalIndicesData = new Float32Array([
                                                  4, 4, 4, 4, 4, 4,
                                                  2, 2, 2, 2, 2, 2,
                                                  3, 3, 3, 3, 3, 3,
                                                  1, 1, 1, 1, 1, 1,
                                                  0, 0, 0, 0, 0, 0,
                                                  5, 5, 5, 5, 5, 5
                                              ]);

    var pMapIndices = new Float32Array([
                                           0, 2, 3, 0, 3, 1,
                                           0, 2, 3, 0, 3, 1,
                                           0, 2, 3, 0, 3, 1,
                                           0, 2, 3, 0, 3, 1,
                                           0, 2, 3, 0, 3, 1,
                                           0, 2, 3, 0, 3, 1
                                       ]);

    var pSerialData = new Float32Array(pNormalIndicesData.length);
    for (var i = 0; i < pSerialData.length; i++) {
        pSerialData[i] = i % 3;
    };

    var iNorm, iPos, iMap;

    pMesh = new a.Mesh(pEngine, eOptions || a.Mesh.VB_READABLE, sName || 'cube');
    pSubMesh = pMesh.createSubset('cube::main');

    iNorm = pSubMesh.data.allocateData([VE_VEC3('NORMAL')], pNormalsData);
    iPos  = pSubMesh.data.allocateData([VE_VEC3('POSITION')], pVerticesData);
    iMap  = pSubMesh.data.allocateData([VE_VEC3('TEXCOORD0')], pMapData);

    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX0')], pVertexIndicesData);
    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX1')], pNormalIndicesData);
    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX2')], pMapIndices);

    pSubMesh.data.index(iPos,  'INDEX0');
    pSubMesh.data.index(iNorm, 'INDEX1');
    pSubMesh.data.index(iMap,  'INDEX2');
//
//    pSubMesh.applyFlexMaterial('default');
    var pMat = pSubMesh.material;
    pMat.diffuse = new a.Color4f(0., 0.5, 0., 1.);
    pMat.ambient = new a.Color4f(0.7, 0., 0., 1.);
    pMat.specular = new a.Color4f(1., 0.7, 0. ,1);
    pMat.shininess = 30.;

    //trace(pSubMesh._pMap.toString());

    return pMesh;
}

function basis(pEngine, eOptions) {
    var pMesh, pSubMesh, pMaterial;
    var iPos, iNorm;

    pMesh = new a.Mesh(pEngine, eOptions || a.Mesh.VB_READABLE, 'basis');
    iNorm   = pMesh.data.allocateData([VE_VEC3('NORMAL')],     new Float32Array([1,0,0]));
    
    function createAxis(sName, pCoords, pColor) {
        pSubMesh = pMesh.createSubset(sName, a.PRIMTYPE.LINELIST);
        
        iPos    = pSubMesh.data.allocateData([VE_VEC3('POSITION')],    pCoords);
        pSubMesh.data.allocateIndex([VE_FLOAT('INDEX0')],   new Float32Array([0,1]));
        pSubMesh.data.allocateIndex([VE_FLOAT('INDEX1')],     new Float32Array([0,0]));
        pSubMesh.data.index(iPos, 'INDEX0');
        pSubMesh.data.index(iNorm, 'INDEX1');

        pSubMesh.applyFlexMaterial(sName + '-color');
        pMaterial = pSubMesh.getFlexMaterial(sName + '-color');
        pMaterial.emissive = pColor;
        pMaterial.ambient = pColor;
        pMaterial.diffuse = pColor;
        pMaterial.shininess = 100.;
    }

    createAxis('basis::X-axis', new Float32Array([0,0,0, 1,0,0]), new a.Color4f(1, 0, 0, 1.));
    createAxis('basis::Y-axis', new Float32Array([0,0,0, 0,1,0]), new a.Color4f(0, 1, 0, 1.));
    createAxis('basis::Z-axis', new Float32Array([0,0,0, 0,0,1]), new a.Color4f(0, 0, 1, 1.));

    return pMesh;
}

function basisSolid(pEngine, eOptions) {
    var pMesh, pSubMesh, pMaterial;
    var iPos, iNorm;

    var pVerticesData = new Float32Array([
                                             0,0,0,
                                             1,0,0,
                                             0,1,0,
                                             0,0,1
                                         ]);

    var pNormalsData = new Float32Array([0, 0, 0]);
    
    var pVertexIndicesData = new Float32Array([0,1,0,2,0,3]);
    var pNormalIndicesData = new Float32Array([0,0,0,0,0,0]);

    pMesh = new a.Mesh(pEngine, eOptions || a.Mesh.VB_READABLE, 'basis-solid');
    pSubMesh = pMesh.createSubset('axis', a.PRIMTYPE.LINELIST);
        
    iPos    = pSubMesh.data.allocateData([VE_VEC3('POSITION')], pVerticesData);
    iNorm   = pSubMesh.data.allocateData([VE_VEC3('NORMAL')],   pNormalsData);
    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX0')],   pVertexIndicesData);
    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX1')],     pNormalIndicesData);
    pSubMesh.data.index(iPos, 'INDEX0');
    pSubMesh.data.index(iNorm, 'INDEX1');

    pSubMesh.applyFlexMaterial('default');
    pMaterial = pSubMesh.getFlexMaterial('default');
    pMaterial.diffuse = new a.Color4f(1, 0, 0, 1);
    pMaterial.emissive = new a.Color4f(1, 0, 0, 1.);
    pMaterial.shininess = 100.;

    return pMesh;
}

function sceneSurface(pEngine, n) {
    n = n || 100;
    var nCellW = nCellW || (n + 1);
    var nCellH = nCellH || (n + 1);

    var nScaleX = nCellW - 1;
    var nScaleY = nCellH - 1;

    var pMesh, pSubMesh;
    var iPos;
    //var nCells = nCellW * nCellH;
    var pVerticesData = new Float32Array((nCellW + nCellH) * 6);

    var fStepX = 1.0 / (nCellW - 1);
    var fStepY = 1.0 / (nCellH - 1);
    var n = 0;

    for (var z = 0; z < nCellH; ++ z) {
        pVerticesData[n]        = (-.5) * nScaleX;
        pVerticesData[n + 2]    = (z * fStepY -.5) * nScaleY;
        n += 3;
        
        pVerticesData[n]        = (.5) * nScaleX;
        pVerticesData[n + 2]    = (z * fStepY -.5) * nScaleY;
        n += 3;
    }

    for (var x = 0; x < nCellW; ++ x) {
        pVerticesData[n]        = (x * fStepX -.5)  * nScaleX;
        pVerticesData[n + 2]    = (-.5) * nScaleY;
        n += 3;

        pVerticesData[n]        = (x * fStepX -.5) * nScaleX;
        pVerticesData[n + 2]    = (.5) * nScaleY;
        n += 3;
    }



    var pVertexIndicesData = new Float32Array((nCellW + nCellH) * 2);

    n = 0;
    for (var z = 0; z < nCellH; ++ z) {
        pVertexIndicesData[n ++]   = z * 2;
        pVertexIndicesData[n ++]   = z * 2 + 1;
    };

    for (var x = 0; x < nCellW; ++ x) {
        pVertexIndicesData[n ++]   = nCellH * 2 + x * 2;
        pVertexIndicesData[n ++]   = nCellH * 2 + x * 2 + 1;
    };

    pMesh = new a.Mesh(pEngine, 0, 'scene-surface');//a.RenderDataBuffer.VB_READABLE
    pSubMesh = pMesh.createSubset('plane::main', a.PRIMTYPE.LINELIST);
    pSubMesh.data.allocateData([VE_VEC3('POSITION')], pVerticesData);
    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX_POSITION')], pVertexIndicesData);
    pSubMesh.data.index('POSITION', 'INDEX_POSITION');
    pSubMesh.applyFlexMaterial('default');

    return pMesh;
}

function screenSprite(pEngine){
    var pMesh = new a.Mesh(pEngine, 0, 'screen-sprite');//a.RenderDataBuffer.VB_READABLE
    var pSubMesh = pMesh.createSubset('screen-sprite :: main', a.PRIMTYPE.TRIANGLESTRIP);
    pSubMesh.data.allocateAttribute([VE_VEC2('POSITION')], new Float32Array([-1,-1,-1,1,1,-1,1,1]));

    return pMesh;
}

function plane (pEngine, eOptions, sName, nCellW, nCellH) {
    nCellW = nCellW || 25;
    nCellH = nCellH || 25;

    var pMesh, pSubMesh;
    var iPos, iNorm;
    var nCells = nCellW * nCellH;

    var pVerticesData = new Float32Array(nCells * 3);
    var pNormalsData = new Float32Array([0.0, 0.0, 1.0]);

    var fStepX = 1.0 / (nCellW - 1);
    var fStepY = 1.0 / (nCellH - 1);
    var n = 0;

    for (var z = 0; z < nCellH; ++ z) {
        for (var x = 0; x < nCellW; ++ x) {
            pVerticesData[n]        = x * fStepX -.5;
            pVerticesData[n + 2]    = z * fStepY -.5;
            n += 3;
        }
    };

    var pVertexIndicesData = new Float32Array(nCells * 6);
    var pNormalIndicesData = new Float32Array(nCells * 6);

    n = 0;
    for (var z = 0; z < nCellH - 1; ++ z) {
        for (var x = 0; x < nCellW - 1; ++ x) {
            pVertexIndicesData[n]       = (z + 1) * nCellW + x;
            pVertexIndicesData[n + 1]   = (z + 0) * nCellW + x + 1;
            pVertexIndicesData[n + 2]   = (z + 0) * nCellW + x;
            pVertexIndicesData[n + 3]   = pVertexIndicesData[n];
            pVertexIndicesData[n + 4]   = pVertexIndicesData[n] + 1;
            pVertexIndicesData[n + 5]   = pVertexIndicesData[n + 1];
        }
        n += 6;
    };

    pMesh = new a.Mesh(pEngine, eOptions || a.Mesh.VB_READABLE, sName || 'plane');
    pSubMesh = pMesh.createSubset('plane::main', a.PRIMTYPE.TRIANGLELIST);

    iNorm = pSubMesh.data.allocateData([VE_VEC3('NORMAL')], pNormalsData);
    iPos = pSubMesh.data.allocateData([VE_VEC3('POSITION')], pVerticesData);

    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX_POSITION')], pVertexIndicesData);
    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX_NORMAL')], pNormalIndicesData);

    pSubMesh.data.index(iPos, 'INDEX_POSITION');
    pSubMesh.data.index(iNorm, 'INDEX_NORMAL');
    pSubMesh.applyFlexMaterial('default');

    return pMesh;
}

function quad (pEngine, fSize, eOptions, sName) {
    var pMesh, pSubMesh;
    var iPos, iNorm;
    fSize = fSize || 20.0;

    var pVerticesData = new Float32Array([
                                             -fSize,0,-fSize,
                                             fSize,0,-fSize,
                                             -fSize,0,fSize,
                                             fSize,0,fSize
                                         ]);
    var pNormalsData = new Float32Array([
                                            0,1,0
                                        ]);
    var pVertexIndicesData = new Float32Array([
                                                  0,1,2,3
                                              ]);
    var pNormalIndicesData = new Float32Array([
                                                  0,0,0,0
                                              ]);


    var iNorm, iPos;

    pMesh = new a.Mesh(pEngine, eOptions || 0, sName || 'quad');
    pSubMesh = pMesh.createSubset('quad::main', a.PRIMTYPE.TRIANGLESTRIP);
    iNorm = pSubMesh.data.allocateData([VE_VEC3('NORMAL')], pNormalsData);
    iPos = pSubMesh.data.allocateData([VE_VEC3('POSITION')], pVerticesData);
    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX0')], pVertexIndicesData);
    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX1')], pNormalIndicesData);
    pSubMesh.data.index(iPos, 'INDEX0');
    pSubMesh.data.index(iNorm, 'INDEX1');
//    pSubMesh.applyFlexMaterial('default');
//    var pMat = pSubMesh.getFlexMaterial('default');
//    pMat.diffuse = new a.Color4f(0.5, 0., 0., 1.);
//    pMat.ambient = new a.Color4f(0.7, 0., 0., 1.);
//    pMat.specular = new a.Color4f(1., 0.7, 0. ,1);
//    pMat.shininess = 30.;
    var pMat = pSubMesh.material;
    pMat.diffuse = new a.Color4f(0.5, 0., 0., 1.);
    pMat.ambient = new a.Color4f(0.7, 0., 0., 1.);
    pMat.specular = new a.Color4f(1., 0.7, 0. ,1);
    pMat.shininess = 30.;
    //trace(pSubMesh._pMap.toString());

    return pMesh;
}