Define(A_IDE_REGISTER_TEMPLATE(template), function () {
	a.IDE.tpl[template] = template;
})
Define(A_IDE_REGISTER_PLUGIN(plugin), function () {
	a.IDE.plug.plugin = plugin;
});

function MainFrame () {

	this.pMainWin = null;

	this.pTemplateParser = new a.ui.TemplateParser(this);
}

PROPERTY(MainFrame, 'menu',
	function () {
		return this.pMainWin.component('main-menu');
	});

MainFrame.prototype.initializeTemplates = function() {
	//register templates
	for (var i in a.IDE.tpl) {
		if (!this.template( a.IDE.tpl[i])) {
			return false;
		}
	}

	return true;
};

MainFrame.prototype.initializePlugins = function() {
	//register plugins
	for (var i in a.IDE.plug) {
		if (!this.plugin(new a.IDE.plug[i](this))) {
			return false;
		}
	}

	return true;
};

MainFrame.prototype.initializeUIEnvironment = function() {
	var pErrDlg;
	var pMainWin;
	
	if (!this.initializeTemplates()) {
		return false;
	}

	if (!a.info.support.webgl || 1) {
		
		pErrDlg = new a.ui.Dialog(this, 'messagebox::error');
		pErrDlg.show({
			'title': tr('webgl not supported'),
			'info': tr('visit http://http://get.webgl.org/ for more info')
		});
		
		return false;
	}

	pMainWin = new a.ui.Component(this, 'main');
	pMainWin.show();

	// if (!this.create('scene-3d')) {

	// 	pErrDlg = new a.ui.Component(this, 'messagebox::error');
	// 	pErrDlg.show({
	// 		'title': tr('system error'),
	// 		'info': tr('cannot create engine...')
	// 	});

	// 	return false;
	// }

	if (!this.initializePlugins()) {
		return false;
	}

	return true;
};

MainFrame.prototype.findTemplate = function(sName) {
	return this.pTemplateParser.getTemplate(sName);
};

MainFrame.prototype.template = function(sTemplate) {
	this.pTemplateParser.load(sTemplate);
	return true;
};

MainFrame.prototype.plugin = function(pPlugin) {
	// body...
};



function main () {
	(new MainFrame()).initializeUIEnvironment();
}
