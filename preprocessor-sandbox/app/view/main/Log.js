Ext.define('PP.view.main.Log', {
	 alias: 'widget.log',
	 extend: 'Ext.panel.Panel',

	 layout: {
		  type: 'fit'
	 },
	 width: 800,
	 title: 'Лог',
	 region: 'south',
	 
	 collapsible: false,

	 initComponent: function() {

		  this.items = [
		  {
				xtype: 'textareafield',
				inputId: 'Log',
				itemId: 'Log',
				name: 'Log'
		  }
		  ];
 
		  this.callParent(arguments);
	 }
});