function TestPlugin() {
	A_CLASS;

	this.pAboutItem = null;
	this.pAboutDialog = null;
}

EXTENDS(TestPlugin, a.IDE.PluginBase);

TestPlugin.prototype.init = function() {
	this.pAboutItem = new a.UIItem(this, 'About');
	this.pAboutDialog = new a.UIComponent(this, 'TestPlugin::test');

	this.connect(this.pAboutItem, a.UI.EVENT.CLICK, this.onAboutClick);
	this.menu.append('Help', this.pAboutDialog);
};

TestPlugin.prototype.onAboutClick = function() {
	this.pAboutDialog.show();
};

A_IDE_REGISTER_TEMPLATE('test.tpl');
A_IDE_REGISTER_PLUGIN(TestPlugin);