Ext.define('PP.store.PreprocCommands', {
    extend: 'Ext.data.Store',
    model: 'PP.model.PreprocCommands',
	 autoLoad: true,
    proxy: {
        type: 'ajax',
        api: {
				read: 'data/preprocCommands.json'
		  },
		  reader: {
				type: 'json',
				root: 'commands',
				successProperty: 'success'
		  }
    }
});