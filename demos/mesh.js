Include('geom.js')
Insert('../media/scripts/html5slider.js');

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

    function addMeshToScene(pEngine, pMesh, pParent) {
        var pSceneObject = new a.SceneModel(pEngine, pMesh);
        pSceneObject.create();
        pSceneObject.attachToParent(pParent || pEngine.getRootNode());
        return pSceneObject;
    }

    this.pCubeMesh = cube(this);

    this.appendMesh = function (pMesh, pNode) {
        return addMeshToScene(me, pMesh, pNode);
    }
    
    this.pPlane = addMeshToScene(this, sceneSurface(this));
    this.pPlane.bNoRender = true;
    this.pPlane.setScale(200.0);

    this.pDrawMeshTexProg = a.loadProgram(this, '../effects/mesh.glsl', {'USE_TEXTURE_MATERIALS': 1});
    this.pDrawMeshProg = a.loadProgram(this, '../effects/mesh.glsl');
    this.pDrawPlaneProg = a.loadProgram(this, '../effects/plane.glsl');
    this.pDrawMeshI2IProg = a.loadProgram(this, '../effects/mesh_ai.glsl');
    this.pDrawMeshAnimProg = a.loadProgram(this, '../effects/mesh.glsl', {
        'USE_TEXTURE_MATERIALS': 1, 
        'USE_ANIMATION': 1
    });

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
  
    //default scene models
    for (var i = 0; i < 1; i++) {
        COLLADA(this, {
            file: '/akra-engine-general/media/models/max_test/max_anim_test.DAE',//astroBoy_walk_Max.DAE
            success: this.onColladaLoad,
            animation: false
        });
    }


	return true;
};

MeshDemo.prototype.onColladaLoad = function (pNodes, pAnimations) {
    'use strict';
    
    //var v3f = [Math.random() * 100 - 50.0, 0.0, Math.random() * 100 - 50.0];
    var v3f = [0,0,0];
    for (var i = 0; i < pNodes.length; ++ i) {
        pNodes[i].attachToParent(this.getRootNode());
        pNodes[i].setScale(5);
        pNodes[i].addRelPosition(v3f.X, v3f.Z, 0.0);
    }


    //trace(this.getRootNode().toString(true));
    if (pAnimations) {
        for (var i = 0; i < pNodes.length; ++ i) {
            if (pNodes[i].findMesh) {
                trace(i, '<< mesh');
            }
        }
        var pSkeleton = pNodes[0].findMesh()[0].getSkin().skeleton;
        
        for (var i = 0; i < pAnimations.length; ++ i) {
            pAnimations[i].bind(pSkeleton);
            pAnimations[i].attachToTimeline(0.);
        }
        //trace(pAnimations);
        pNodes[1].pAnimations = pAnimations;

        var pSlider = document.createElement('input');
        var pTiming = this.displayManager().draw2DText(200, 50, new a.Font2D(20, '#FFF'));
        
        pSlider.type = "range";
        pSlider.min = 0;
        pSlider.max = 100;
        pSlider.step = 1;
        pSlider.value = 0;

        var fnSliderChange = function () {
            
            var fTime = this.value / 100.0 * 1.16667;
            pTiming.edit(fTime + ' sec / ' + this.value);
            for (var i = 0; i < pAnimations.length; ++ i) {
                pAnimations[i].play(fTime);
            }   
        };

        pSlider.onchange = fnSliderChange;

        pSlider.style.position = "absolute";
        pSlider.style.top = "50px";
        pSlider.style.zIndex = "100";

        document.getElementById('wrapper').appendChild(pSlider);

        document.body.addEventListener("keypress", function(e) {
            e = window.event || e;
            e = e.charCode || e.keyCode;

            if (e == a.KEY.F1) {
                pSlider.value = Number(pSlider.value) + 1.0;
                if (pSlider.value > 100) pSlider.value = 100;
                fnSliderChange.call(pSlider);
            }
            else if (e == a.KEY.F2) {
                pSlider.value -= 1;
                if (pSlider.value < 0) pSlider.value = 0;
                fnSliderChange.call(pSlider);
            }
        }, false);

        fnSliderChange.call(pSlider);
    }
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
                trace('##################### NEW MODEL #####################');     
                COLLADA(me, 
                    {
                        content: e.target.result,
                        success: me.onColladaLoad
                    });
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

    //draw plane
    this.pDrawPlaneProg.activate();
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