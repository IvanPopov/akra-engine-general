Ext.define('PP.view.settings.SettingsWindow', {
	 alias: 'widget.settingswindow',
	 extend: 'Ext.window.Window',
	 title: 'Настройки',
	 closable: true,
	 autoShow: true,
	 closeAction: 'destroy',
	 layout: 'fit',
	 constrain: true,
	 
	 initComponent: function() {
		  this.x = PP.Settings.getInt("ApplicationSetingsPositionX");
		  this.y = PP.Settings.getInt("ApplicationSetingsPositionY");
		  this.width  = PP.Settings.get("ApplicationSetingsWidth");
		  this.height = PP.Settings.get("ApplicationSetingsHeight");
		  this.items = [
		  {
				xtype: 'settingspanel'
		  }
		  ];
		  this.callParent(arguments);		
	 }
	 
				
});