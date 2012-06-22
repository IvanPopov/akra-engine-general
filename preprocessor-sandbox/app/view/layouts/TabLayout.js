Ext.define('PP.view.layouts.TabLayout', {
    alias: 'widget.tablayout',
    extend: 'Ext.tab.Panel',  
    activeTab: 0,
    deferredRender: false,
    itemId: 'tabLayout',
    initComponent: function() {

        this.items = [
        {
            xtype: 'rawcode'
        },{
            xtype: 'preprocessedcode'
        }
        ];
 
        this.callParent(arguments);
    }
});