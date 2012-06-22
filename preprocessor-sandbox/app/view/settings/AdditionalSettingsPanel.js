Ext.define('PP.view.settings.AdditionalSettingsPanel', {
	 alias: 'widget.additionalsettingspanel',
	 extend: 'Ext.panel.Panel',
	 layout: {
		  type: 'fit'
	 },
	 
	 padding: 15,
	 title: 'Дополнительно',
	 initComponent: function() {
		  this.items = [
		  {
				border: 0,
				html: "Когда-нибудь здесь что-нибудь будет)"
		  }
		  ]
 
		  this.callParent(arguments);
	 }
});