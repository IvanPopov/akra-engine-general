function ShaderDemo() {
    A_CLASS;
    STATIC(fMoveSpeed,1.);
};

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
    this.shaderManager().loadEffectFile('http://akra/akra-engine-general/media/effects/Demo_simple.fx');
    this.notifyInitDeviceObjects();
    return true;
};

ShaderDemo.prototype.directRender = function() {
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