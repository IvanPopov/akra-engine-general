Define(A_IDE_TEMPLATES_PATH, './tpls/');
Define(A_IDE_PLUGINS_PATH, './plugins/');

Define(A_IDE_REGISTER_TEMPLATE(template), function () {
	a.IDE.tpl.push(template);
})
Define(A_IDE_REGISTER_PLUGIN(plugin), function () {
	a.IDE.plug.plugin = plugin;
});

A_IDE_REGISTER_TEMPLATE('main-scene.tpl');

function MainFrame () {
	A_CLASS;

	this.pMainWin = null;
}

EXTENDS(MainFrame, a.Engine);

PROPERTY(MainFrame, 'menu',
	function () {
		return this.pMainWin.component('main-menu');
	});

MainFrame.prototype.initializeUIEnvironment = function() {
	var pErrDlg;
	var pMainWin;
	
	if (!a.info.support.webgl) {
		
		pErrDlg = new a.UIComponent(this, 'messagebox::error');
		pErrDlg.show({
			'title': tr('webgl not supported'),
			'info': tr('visit http://http://get.webgl.org/ for more info')
		});
		
		return false;
	}

	pMainWin = new a.UIComponent(this, 'main');
	pMainWin.show();

	if (!this.create('scene-3d')) {

		pErrDlg = new a.UIComponent(this, 'messagebox::error');
		pErrDlg.show({
			'title': tr('system error'),
			'info': tr('cannot create engine...')
		});

		return false;
	}

	//register templates
	for (var i in a.IDE.tpl) {
		if (!this.template(new a.UITpl(a.IDE.tpl[i]))) {
			return false;
		}
	}

	//register plugins
	for (var i in a.IDE.plug) {
		if (!this.plugin(new a.IDE.plug[i](this))) {
			return false;
		}
	}

	return true;
};

MainFrame.prototype.template = function(pTemplate) {
	//TODO: template...
};

MainFrame.prototype.plugin = function(pPlugin) {
	// body...
};

MainFrame.prototype.oneTimeSceneInit = function () {
	this.notifyOneTimeSceneInit();
	this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0.0, 500.0));
	return true;
}; 

MainFrame.prototype.restoreDeviceObjects = function () {
	this.notifyRestoreDeviceObjects();
	return true;
};


MainFrame.prototype.initDeviceObjects = function () {
	this.notifyInitDeviceObjects();
	return true;
};

MainFrame.prototype.deleteDeviceObjects = function () {
	this.notifyDeleteDeviceObjects();
	return true;
};

MainFrame.prototype.updateScene = function () {
	this.updateCamera(1.0, 0.1, null, 30.0, false);
	return this.notifyUpdateScene();
};

(new MainFrame()).initializeUIEnvironment();

