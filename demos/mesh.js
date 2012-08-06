Include('geom.js')
Insert('../media/scripts/html5slider.js');

function MeshDemo() {
    A_CLASS;
}
;

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
    this.pBiasMesh = bias(this);

    this.appendMesh = function (pMesh, pNode) {
        return addMeshToScene(me, pMesh, pNode);
    }

    var pBias = this.pBias = this.appendMesh(this.pBiasMesh);
    pBias.bNoRender = true;
    pBias.setScale(10);
    pBias.setPosition(0., 0., -20.);
    pBias.addRelRotation(Math.PI, Math.PI / 2, Math.PI / 2);
    console.log(
        "shaderStr:",
        Mat4.shaderStr(
            Quat4.toMat4(
                Quat4.fromXYZ(Math.PI, Math.PI / 2, Math.PI / 2)
            )
        ),
        "\nstr:",
        Mat4.str(
            Quat4.toMat4(
                Quat4.fromXYZ(Math.PI, Math.PI / 2, Math.PI / 2)
            )
        )
    );

    var pBias2 = this.pBias2 = this.appendMesh(this.pBiasMesh);
    pBias2.bNoRender = true;
    pBias2.setScale(10);
    pBias2.setPosition(0, 0, -20.);

    this.pPlane = addMeshToScene(this, sceneSurface(this));
    this.pPlane.bNoRender = true;
    this.pPlane.setScale(200.0);

    this.pDrawBiasProg = a.loadProgram(this, '../effects/bias.glsl');
    this.pDrawMeshProg = a.loadProgram(this, '../effects/mesh.glsl');
    this.pDrawMeshTexProg = a.loadProgram(this, '../effects/mesh.glsl', {'USE_TEXTURE_MATERIALS' : 1});
    this.pDrawPlaneProg = a.loadProgram(this, '../effects/plane.glsl');
    this.pDrawMeshI2IProg = a.loadProgram(this, '../effects/mesh_ai.glsl');
    this.pDrawMeshAnimProgTex = a.loadProgram(this, '../effects/mesh.glsl', {
        'USE_TEXTURE_MATERIALS' : 1,
        'USE_ANIMATION'         : 1
    });
    this.pDrawMeshAnimProg = a.loadProgram(this, '../effects/mesh.glsl', {
        'USE_ANIMATION' : 1
    });

    var pCamera = this.getActiveCamera();
    // pCamera.addRelPosition(-.0, 10.0, 0.0);
    pCamera.addRelPosition(0, 10.0, -5.0);
    pCamera.addRelRotation(0, Math.PI / 5, 0);


    if (a.info.support.api.file === false) {
        error('file api unsupported...');
    }

    var pDropZone = this.displayManager().getTextLayer();

    pDropZone.addEventListener('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }, false);

    pDropZone.addEventListener('drop', function (e) {
        me.onFileDrop(e)
    }, false);

    //default scene models
    var pDemos = {
        'CMan'          : '',
        'astroBoy'      : 'astroBoy_walk_Max.DAE',
        'hero_model'    : 'demo/mesh_chr.DAE',
        'hero_anim_run' : 'demo/anim_chr_run_2.DAE',
        'hero_anim_idl' : 'demo/anim_chr_idle.DAE'
    };

//    for (var i = 0; i < 1; i++) {
//    COLLADA(this, {
//        file: '/akra-engine-general/media/models/' + pDemos['hero_model'],
//        success: function (pNodes, pMeshes, pAnimations) {
//
//            COLLADA(this, {
//                file: '/akra-engine-general/media/models/' + pDemos['hero_anim_run'],
//                animation: true,
//                scene: true,
//                success: function (pNodes2, pMeshes2, pAnimations2) {
//                    //trace(pAnimations.length, '<< animations')
//                    //trace(pMeshes[0][0].skin.skeleton.name);
//
//                    me.onColladaLoad(pNodes, pMeshes, pAnimations2);
//                }
//            });
//
//            //me.onColladaLoad(pNodes, pMeshes, pAnimations);
//        },
//        animation: false,
//        wireframe: false,
//        drawJoints: true
//    });
//    }

    return true;
};

MeshDemo.prototype.displayAnimation = function (pNodes, pMeshes, pAnimations) {
    if (pAnimations) {
        //var pSkeleton = pMeshes[0][0].skin.skeleton;
        //trace('skeleton > ', pSkeleton.name);

        for (var i = 0; i < pAnimations.length; ++i) {
            //pAnimations[i].bind(pSkeleton);
            pAnimations[i].bind(this.getRootNode());
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
        var me = this;
        this.fAngle = 0;
        var fnSliderChange = function () {

            var fTime = this.value / 100.0 * pAnimations[0]._fDuration;
            pTiming.edit(fTime + ' sec / ' + this.value);
            for (var i = 0; i < pAnimations.length; ++i) {
                pAnimations[i].play(fTime);
            }
        };
        this.animStep = function () {
            pSlider.value++;
            me.fAngle++;
            if (pSlider.value == 100) {
                pSlider.value = 0;
            }
            if (me.fAngle >= 360) {
                me.fAngle = 0;
            }

            for (var i = 0; i < pNodes.length; ++i) {
                pNodes[i].setPosition(
                    Math.cos(me.fAngle / 180 * Math.PI) * 20,
                    0,
                    Math.sin(me.fAngle / 180 * Math.PI) * 20);
                pNodes[i].setRotation(me.fAngle / 180 * Math.PI, Math.PI / 2, 0);
            }

            fnSliderChange.call(pSlider);
        }

        pSlider.onchange = fnSliderChange;

        pSlider.style.position = "absolute";
        pSlider.style.top = "50px";
        pSlider.style.zIndex = "100";

        document.getElementById('wrapper').appendChild(pSlider);

        document.body.addEventListener("keypress", function (e) {
            e = window.event || e;
            e = e.charCode || e.keyCode;

            if (e == a.KEY.F1) {
                pSlider.value = Number(pSlider.value) + 1.0;
                if (pSlider.value > 100) {
                    pSlider.value = 100;
                }
                fnSliderChange.call(pSlider);
            }
            else if (e == a.KEY.F2) {
                pSlider.value -= 1;
                if (pSlider.value < 0) {
                    pSlider.value = 0;
                }
                fnSliderChange.call(pSlider);
            }
        }, false);

        fnSliderChange.call(pSlider);
    }
}

MeshDemo.prototype.onColladaLoad = function (pNodes, pMeshes, pAnimations) {
    'use strict';

    if (pNodes) {
        //var v3f = [Math.random() * 100 - 50.0, 0.0, Math.random() * 100 - 50.0];
        var v3f = [0, 0, 0];
        for (var i = 0; i < pNodes.length; ++i) {
            pNodes[i].attachToParent(this.getRootNode());
            pNodes[i].addRelRotation(0, -Math.PI / 2, 0);
            pNodes[i].setScale(5);
            pNodes[i].addRelPosition(v3f.X, v3f.Z, 0.0);
        }
    }

    this.displayAnimation(pNodes, pMeshes, pAnimations);
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
        reader.onload = (function (theFile) {
            return function (e) {
                trace('##################### NEW MODEL #####################');
                COLLADA(me,
                        {
                            content : e.target.result,
                            success : me.onColladaLoad
                        });
            };
        })(f);

        reader.readAsText(f);
    }
};

MeshDemo.prototype.directRender = function () {
    'use strict';

    var pCamera = this._pDefaultCamera;
    if (this.animStep) {
        this.animStep();
    }
    function draw(pProgram, pModel, hasMat) {
        //trace(arguments);
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
    this.pDrawBiasProg.activate();
    draw(this.pDrawBiasProg, this.pBias, false);

    this.pDrawBiasProg.activate();
    draw(this.pDrawBiasProg, this.pBias2, false);
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

        pCamera.addRelRotation(fdX, fdY, 0);
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