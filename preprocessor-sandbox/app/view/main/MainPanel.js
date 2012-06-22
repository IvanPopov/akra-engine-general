Ext.define('PP.view.main.MainPanel', {
    alias: 'widget.mainpanel',
    extend: 'Ext.panel.Panel',
    layout: {
        type: 'fit'
    },
    title: 'Препроцессор',

    initComponent: function() {
		  var layout;
		  
		  if(PP.Settings.eq("PanelLayout","LayoutTab"))
				layout = 'tablayout'
		  else if(PP.Settings.eq("PanelLayout", "LayoutColumn"))
				layout = 'columnlayout'
		  else
				layout = 'tablayout'
		  
        this.items = [
        {
					 xtype: layout
        }];
 
        this.dockedItems = [
        {
            xtype: 'mainmenu'
        }
        ];
 
        this.callParent(arguments);
    }
});