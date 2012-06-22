function MyGame () {
//Вызываем конструктор класса родителя
MyGame.superclass.constructor.apply(this, arguments);

this.pSkyModel=null;
this.pSkyMap=null;
this.pSkyMethod=null;
this.pSkyMaterial=null;
this.pDefaultText = null;
}

//Наследуем новое приложение от движка. В нем определены
a.extend(MyGame, a.Engine);

//Инициализация данных приложения
MyGame.prototype.oneTimeSceneInit = function ()
{
//Инициализация данных приложения по умолчанию
this.notifyOneTimeSceneInit();

this.pResourceManager.monitorInitResources(function (nLoaded, nTotal, pTarget) {
console.log('loaded:', nLoaded / nTotal, '%', pTarget.findResourceName());
var fVal = nLoaded / nTotal * 100;

});

this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0.0, 500.0));
this.showStats(true);


this.pSkyMethod = this.pDisplayManager.renderMethodPool().createResource("sky box method");

//this.pRenderMethod.loadEffect(this.RenderMethod.defaultMethod,"media\\shaders\\simple_terrain.fx");
this.pSkyMethod.loadEffect(0, "/sources/effects/simple_skybox.fx.js");

this.pSkyMap = this.pDisplayManager.texturePool().createResource("sky box texture");
this.pSkyMap.loadResource("/media/textures/sky_box1.dds");

return true;
}


//Перенсение ресурсов в энергозависимую память
MyGame.prototype.restoreDeviceObjects = function () {
//Перенсение ресурсов в энергозависимую память по умолчанию
//this.notifyRestoreDeviceObjectsDefault();
this.notifyRestoreDeviceObjects();
return true;
}

//Инициализация объектов на сцене
MyGame.prototype.initDeviceObjects = function () {
//Инициализация объектов на сцене по умолчанию
this.notifyInitDeviceObjects();

this.pSkyModel = new a.SkyModel(this);

this.pSkyModel.create(a.SkyModel.Box);

this.pSkyMaterial = this.pDisplayManager.surfaceMaterialPool().createResource("sky box material");
this.pSkyMaterial.setTexture(0, this.pSkyMap);

this.pSkyMethod.setMaterial(0, this.pSkyMaterial);

this.pSkyModel.setRenderMethod(this.pSkyMethod);


//Обновление камер(не знаю зачем оно тут нужно)
this.getDefaultCamera().update();
this.updateCamera(10.0, 0.02, null, 30.0, true);

this.pDisplayManager.enableFrameClearing(false);

this.pDefaultText = this.pDisplayManager.draw2DText(this.pCanvas.width - 300, this.pCanvas.height - 20,
new a.Font2D(14, 'AAAAAA', 'Helvetica', false),
"controls: [W, S, A, D], [R, F] and MOUSE");

return true;
}


//Выгрузка объектов сцены
MyGame.prototype.deleteDeviceObjects = function () {
//Уничтожение объектов на сцена
this.pSkyModel.destroy();

//Уничтожение ресурсов на сцене
this.pSkyModel=null;
this.pSkyMap=null;
this.pSkyMethod=null;
this.pSkyMaterial=null;
this.pDefaultText = null;

//Выгрузка по умолчанию
this.notifyDeleteDeviceObjects();
return true;
}

//Действия при обновлении сцены
MyGame.prototype.updateScene = function () {
//обновляем положение камеры, передаем в нее ландшафт что бы не перелетать за него
this.updateCamera(10.0, 0.1, null, 30.0, false);


//добавим вращение камеры при помощи мыши.
if (this.pKeymap.isMousePress() && this.pKeymap.isMouseMoved()) {
var pCamera = this.getActiveCamera(),
fdX = this.pKeymap.mouseShitfX(),
fdY = this.pKeymap.mouseShitfY(),
pScreen = a.info.screen;

fdX /= pScreen.width / 10.0;
fdY /= pScreen.height / 10.0;

pCamera.addRelRotation(-fdX, -fdY, 0);
}

this.pSkyModel.update();

//Действия по обновлению сцены по дефолту
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