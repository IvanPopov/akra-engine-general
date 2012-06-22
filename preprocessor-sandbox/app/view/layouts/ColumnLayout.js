Ext.define('PP.view.layouts.ColumnLayout', {
	 alias: 'widget.columnlayout',
	 extend: 'Ext.container.Container',
    layout: {
        type: 'border'
    },   
    itemId: 'columnLayout',
	 initComponent: function() {

		  this.items = [
        {
            region: 'west',
            flex: 1,
            split: true,
            xtype: 'rawcode'
        },{
            region: 'center',
            flex: 1,
            split: true,
            xtype: 'preprocessedcode'
        }
        ];
 
		  this.callParent(arguments);
	 }
});