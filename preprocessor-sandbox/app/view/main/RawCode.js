Ext.define('PP.view.main.RawCode', {
	 alias: 'widget.rawcode',
	 extend: 'Ext.panel.Panel',

	 layout: {
		  type: 'fit'
	 },
    itemId: 'rawCode',
	 title: 'Исходный код',
	 initComponent: function() {

		  this.items = [
		  {
				xtype: 'textareafield',
            itemId: 'rawCode',
				inputId: "rawCodeField",
				//name: 'RawCode'
		  }
		  ];
 
		  this.callParent(arguments);
	 }
});