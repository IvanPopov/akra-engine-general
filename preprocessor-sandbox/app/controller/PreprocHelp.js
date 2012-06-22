Ext.define('PP.controller.PreprocHelp', {
	 extend: 'Ext.app.Controller',
	 stores: ['PreprocCommands'],
	 models: ['PreprocCommands'],
	 views: [
		  'preprocHelp.HelpWindow',
		  'preprocHelp.CommandItems'
	 ],	
	 init: function() {
		  this.control({
				'preprochelp': {
					 move: this.onWindowMove,
					 resize: this.onWindowResize
				}
		  });
	 },
	 onWindowMove: function(e, x, y){
		  PP.Settings.set("PreprocHelpWindowPositionX", x);
		  PP.Settings.set("PreprocHelpWindowPositionY", y);
	 },
	 onWindowResize: function(e, width, height){
		  PP.Settings.set("PreprocHelpWindowWidth", width);
		  PP.Settings.set("PreprocHelpWindowHeight", height);
	 }
});