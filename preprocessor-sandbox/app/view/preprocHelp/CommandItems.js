Ext.define('PP.view.preprocHelp.CommandItems', {
	 alias: 'widget.commanditems',
	 extend: 'Ext.grid.Panel',
	 store: 'PreprocCommands',
	 layout: 'fit',
	 initComponent: function() { 
		  this.columns = [
		  {
				xtype:'actioncolumn',
				width: 20,
				align: 'center',
				items: [{
					 icon: 'app/resources/images/add.png',  // Use a URL in the icon config
					 tooltip: 'Добавить в код'
				}]
		  },
		  {
				text: 'Команда', 
				xtype: 'templatecolumn', 
				flex: 1,
				tpl: '<span id="preprocCommand">{command:formatNewLineAndTab}</span> <br><span style="color: #555">{description}</span>'
		  }
		  
		  ];
 
		  this.callParent(arguments);
	 }
});



					 