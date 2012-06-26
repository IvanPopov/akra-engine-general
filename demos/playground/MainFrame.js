Define(A_IDE_REGISTER_PLUGIN(plugin), function () {
	a.IDE.plug.plugin = plugin;
});

function MainFrame () {

	this.pMainWin = null;
}

PROPERTY(MainFrame, 'menu',
	function () {
		return this.pMainWin.component('main-menu');
	});

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

	if (!a.info.support.webgl) {
		
		pErrDlg = new goog.ui.Dialog();
		pErrDlg.setContent(a.ui.messagebox.error({
			'content': tr('webgl not supported'),
			'info': tr('visit http://http://get.webgl.org/ for more info')
		}));
		pErrDlg.setVisible(true);
		
		return false;
	}

	
	
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
