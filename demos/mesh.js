Include('geom.js')

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
    'use strict';
    
	this.notifyInitDeviceObjects();

	var me = this;
    var pProgram;
    
    trace('root node', this.getRootNode());

    function addMeshToScene(pEngine, pMesh) {
        var pSceneObject = new a.SceneModel(pEngine, pMesh);
        pSceneObject.attachToParent(pEngine.getRootNode());
        pSceneObject.create();
        //pSceneObject.addRelPosition(-3, 2.0, 0);
        pSceneObject.bNoRender = true;
        return pSceneObject;
    }

    // this.pCube = addMeshToScene(this, cube(this));
    // this.pTorus = addMeshToScene(this, torus(this));
    this.pPlane = addMeshToScene(this, sceneSurface(this));

    //this.pPlane.addRelPosition(0, -2.0, 0);
    this.pPlane.setScale(200.0);

    this.pDrawMeshProg = a.loadProgram(this, '../effects/mesh.glsl');
    this.pDrawPlaneProg = a.loadProgram(this, '../effects/plane.glsl');
    this.pDrawMeshI2IProg = a.loadProgram(this, '../effects/mesh_ai.glsl');

    var pCamera = this.getActiveCamera();
    pCamera.addRelPosition(-8.0, 5.0, 11.0);
    pCamera.addRelRotation(-3.14/5, -3.14/15, 0);

    if (a.info.support.api.file === false) {
        error('file api unsupported...');
    }

    var pDropZone = this.displayManager().getTextLayer();
    
    pDropZone.addEventListener('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy'; 
    }, false);

    pDropZone.addEventListener('drop', function (e) {me.onFileDrop(e)}, false);

	return true;
};

MeshDemo.prototype.onFileDrop = function (e) {
    'use strict';
    
    e.stopPropagation();
    e.preventDefault();

    var pFiles = e.dataTransfer.files;
    var me = this;
    for (var i = 0, f; f = pFiles[i]; i++) {
        if (f.name.substr(f.name.lastIndexOf('.') + 1) !== 'dae') {
            continue;
        }

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {     
                COLLADA(me, e.target.result,
                    function (pRootNode) {
                        trace(arguments, ' << COLLADA()');
                        pRootNode.attachToParent(me.getRootNode());
                    }, true);
            };
        })(f);

        reader.readAsText(f);
    }
};

MeshDemo.prototype.directRender = function() {
    'use strict';

    var pCamera = this._pDefaultCamera;

    function draw(pProgram, pModel, hasMat) {
        hasMat = ifndef(hasMat, true);
        pProgram.applyMatrix4('model_mat', pModel.worldMatrix());
        pProgram.applyMatrix4('proj_mat', pCamera.projectionMatrix());
        pProgram.applyMatrix4('view_mat', pCamera.viewMatrix());
        
        if (hasMat) {
            pProgram.applyMatrix3('normal_mat', pModel.normalMatrix());
            pProgram.applyVector3('eye_pos', pCamera.worldPosition());
        }

        pModel.findMesh().draw();
    }    

    // this.pDrawMeshProg.activate();
    // this.pDevice.enableVertexAttribArray(0);
    // this.pDevice.enableVertexAttribArray(1);
    // this.pDevice.enableVertexAttribArray(2);

    // this.pTorus.addRelRotation(0.01, 0., -0.01);        
    // this.pCube.addRelRotation(-0.01, 0.01, 0.);
    
    // draw(this.pDrawMeshProg, this.pCube);
    // draw(this.pDrawMeshProg, this.pTorus);


    // if (this.pCollada) {

    //     this.pDrawMeshI2IProg.activate();
    //     for(var i =0; i< this.pCollada.length; i++){
    //         this.pCollada[i].addRelRotation(0.01, 0., 0.);
    //         this.pDrawMeshI2IProg.applyFloat('INDEX_INDEX_POSITION_OFFSET', 0);
    //         this.pDrawMeshI2IProg.applyFloat('INDEX_INDEX_NORMAL_OFFSET', 1);
    //         this.pDrawMeshI2IProg.applyFloat('INDEX_INDEX_FLEXMAT_OFFSET', 2);
    //         draw(this.pDrawMeshI2IProg, this.pCollada[i]);
    //     }
    // }


    //draw plane
    this.pDrawPlaneProg.activate();
    this.pDevice.disableVertexAttribArray(2);
    draw(this.pDrawPlaneProg, this.pPlane, false);
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