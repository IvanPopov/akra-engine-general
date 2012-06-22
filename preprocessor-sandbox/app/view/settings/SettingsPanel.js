Ext.define('PP.view.settings.SettingsPanel', {
	 alias: 'widget.settingspanel',
	 extend: 'Ext.tab.Panel',  
	 activeTab: 0,
	 deferredRender: false,
	 initComponent: function() {
		  this.items = [
		  {
				xtype: 'canvassettingspanel'
		  },
		  {
				xtype: 'additionalsettingspanel'
		  }
		  ];
		  this.bbar = Ext.create('Ext.ux.StatusBar', {
				
            items: [
               
                {
                    xtype: 'button',
						  itemId: 'saveBtn',
                    text: 'Сохранить'
                },
                {
                    xtype: 'button',
						  itemId: 'closeBtn',
                    text: 'Закрыть'
                }
            ]
		  });
		  
		  this.callParent(arguments);
	 }
});