
function MyGame () {
    A_CLASS;
}
a.extend(MyGame, a.Engine);

MyGame.prototype.oneTimeSceneInit = function () {
    this.notifyOneTimeSceneInit();
    this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0.0, 500.0));
    this.showStats(true);

    this.pResourceManager.monitorInitResources(function (nLoaded, nTotal, pTarget) {
        console.log('loaded:', nLoaded / nTotal * 100, '%', pTarget.findResourceName());
    });

    this.pVideoBuffer = this.displayManager().videoBufferPool().createResource('video_test');
    this.pVertexBuffer = this.displayManager().vertexBufferPool().createResource('vertex_buffer');
    return true;
}

MyGame.prototype.restoreDeviceObjects = function () {
    this.notifyRestoreDeviceObjects();
    return true;
}

MyGame.prototype.initDeviceObjects = function () {
    this.notifyInitDeviceObjects();

   // var iEffectFile = this.shaderManager().put(this.pEffectFile);
   // var iEffectTech = this.shaderManager().find(iEffectFile, null);



    var pVertexBuffer = this.pVertexBuffer;
    pVertexBuffer.create(0, 0, (new Float32Array([
        0,1, 1,2, 2,1, 0,0,
        0, 0, 0, 0
    ])));

    var pVideoBuffer = this.pVideoBuffer;
    pVideoBuffer.create(2048, 0);
    //pVideoBuffer.create(0, 0, (new Float32Array([2, 4, 8, 16])).buffer);
    /*
    pVideoBuffer.setData((new Float32Array([10, 20, 30])).buffer, 3 * 4);
    pVideoBuffer.setData((new Uint8Array([1, 2, 3])).buffer, 5 * 4+1);
    pVideoBuffer.setData((new Uint8Array([1])).buffer, 7*4);
    pVideoBuffer.setData((new Float32Array([1])).buffer, 1024)
    */

    /*
     this.nCount = count || 1;
     this.eType = eType || a.DTYPE.FLOAT;
     this.eUsage = eUsage || a.DECLUSAGE.POSITION;
     this.eUsage=this.eUsage.toString().toUpperCase();
     this.iOffset=iOffset;
     */

    var pDecl = [];

    pDecl[0] = new a.VertexDeclaration([
        {nCount: 3, eType: a.DTYPE.FLOAT, eUsage: a.DECLUSAGE.POSITION},
        {nCount: 3, eType: a.DTYPE.FLOAT, eUsage: a.DECLUSAGE.NORMAL}
    ]);

    pDecl[1] = new a.VertexDeclaration([
        {nCount: 3, eType: a.DTYPE.FLOAT, eUsage: a.DECLUSAGE.POSITION1},
        {nCount: 2, eType: a.DTYPE.FLOAT, eUsage: a.DECLUSAGE.TEXCOORD1}
    ]);

    pDecl[2] = new a.VertexDeclaration([
        {nCount: 3, eType: a.DTYPE.FLOAT, eUsage: a.DECLUSAGE.POSITION2},
        {nCount: 3, eType: a.DTYPE.FLOAT, eUsage: a.DECLUSAGE.NORMAL2},
        {nCount: 2, eType: a.DTYPE.FLOAT, eUsage: a.DECLUSAGE.TEXCOORD2}
    ]);

    var pVideoData = [];
    pVideoData[0] = pVideoBuffer.getEmptyVertexData(3, pDecl[0]);
    pVideoData[1] = pVideoBuffer.getEmptyVertexData(2, pDecl[1]);
    pVideoData[2] = pVideoBuffer.getEmptyVertexData(1, pDecl[2]);

    var pVertexData = [];
    pVertexData[0] = pVertexBuffer.getVertexData(0, 4, new a.VertexDeclaration(
        [
            {nCount: 1, eType: a.DTYPE.FLOAT, eUsage: a.DECLUSAGE.INDEX1},
            {nCount: 1, eType: a.DTYPE.FLOAT, eUsage: a.DECLUSAGE.INDEX2}
        ]
    ));

    pVertexData[1] = pVertexBuffer.getVertexData(pVertexData[0].size, 4, new a.VertexDeclaration(
        [
            {nCount: 1, eType: a.DTYPE.FLOAT, eUsage: a.DECLUSAGE.INDEX}
        ]
    ));

    var pMap = new a.BufferMap(this);

    pMap.flow(1, pVideoData[0]);
    pMap.flow(2, pVideoData[1]);
    pMap.flow(3, pVideoData[2]);

    pMap.mapping(1, pVertexData[0], a.DECLUSAGE.INDEX1);
    pMap.mapping(2, pVertexData[0], a.DECLUSAGE.INDEX2);
    pMap.mapping(3, pVertexData[1], a.DECLUSAGE.INDEX);

    return true;
}

MyGame.prototype.deleteDeviceObjects = function () {
    this.notifyDeleteDeviceObjects();
    return true;
}

MyGame.prototype.updateScene = function () {
    this.updateCamera(1.0, 0.1, null, 30.0, false);
    return this.notifyUpdateScene();
}

if (!a.info.support.webgl) {
    alert('Error:: Your browser does not support WebGL.');
}
else {
    //Обявляем приложение
    var App = new MyGame("canvas");
    //Создаем приложение
    if (App.create()) {
        //Запускаем приложение
        App.run();
    }
}