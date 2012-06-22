Ext.define('PP.view.preprocHelp.HelpWindow', {
	 alias: 'widget.preprochelp',
	 extend: 'Ext.window.Window',
	 title: 'Команды препроцессора',
	 closable: true,
	 autoShow: true,
	 closeAction: 'destroy',
	 layout: 'fit',
	 constrain: true,
	 
	 initComponent: function() {
		  this.x = PP.Settings.getInt("PreprocHelpWindowPositionX");
		  this.y = PP.Settings.getInt("PreprocHelpWindowPositionY");
		  this.width  = PP.Settings.get("PreprocHelpWindowWidth");
		  this.height = PP.Settings.get("PreprocHelpWindowHeight");
		  
		  this.items = [{
				xtype: 'commanditems'
		  }];
		  this.callParent(arguments);		
	 }
	 
				
});