Ext.define('PP.view.main.PreprocessedCode', {
	 alias: 'widget.preprocessedcode',
	 extend: 'Ext.panel.Panel',

    layout: {
        type: 'fit'
    },   
    itemId: 'preprocessedCode',
    title: 'Препроцессированный код',
	 initComponent: function() {

		  this.items = [
		  {
				xtype: 'textareafield',
				itemId: 'preprocessedCode',
            inputId: 'preprocessedCodeField',
				//name: 'PreprocessedCode'
		  }
		  ];
 
		  this.callParent(arguments);
	 }
});