Ext.define('PP.view.customPreprocess.CustomPreprocessWindow', {
	 alias: 'widget.customPreprocessWindow',
	 extend: 'Ext.window.Window',
	 title: 'Выборочное препроцессирование',
	 closable: true,
	 closeAction: 'destroy',
	 autoShow: true,
	 layout: 'fit',
	 modal: true,
	 
	 //resizable: false,
	 
	 initComponent: function() {
		  //проставляем каждый раз позицию окна из куки. Эта функция вызывается каждый раз при открытии окна.
		  this.x = PP.Settings.getInt("CustomPreprocessPositionX");
		  this.y = PP.Settings.getInt("CustomPreprocessPositionY");
		  this.width  = PP.Settings.getInt("CustomPreprocessWidth");
		  this.height = PP.Settings.getInt("CustomPreprocessHeight");
		  var options = PP.Settings.getJson("CustomPreprocessOptions");
		  
		  var source = (window.editorSource) ? window.editorSource.getValue() : PP.Settings.get("RawCode");
		  var start = PP.Utils.timestamp();
		  var paths = Preprocessor.code(source, {
				include: true
		  }).include;
		  var end = PP.Utils.timestamp();
		  PP.Utils.delta = end - start;
		  console.log(paths)
		  var pathItems = [];
		  for(var path in paths){
				if(options[path] == false)
					 paths[path] = false;
				pathItems[pathItems.length] = {
					 style: 'font-size: 12px;',
					 xtype: 'label',
					 text: path
				};
				pathItems[pathItems.length] = {
					 xtype: 'checkboxfield',
					 inputValue: path,
					 checked: paths[path]
				};
		  }
		  this.items = [
		  {
				xtype: 'panel',
				bodyPadding: 5,
				autoScroll: true,
				layout: {
					 columns: 2,
					 type: 'table'
				},
				items: pathItems					  
		  }]
		  
		  //		  this.items = [
		  //		  {
		  //				xtype: 'panel',
		  //				autoScroll: true,
		  //				layout: 'fit',
		  //				items: [{
		  //					 xtype: 'fieldset',
		  //					 baseCls: '',
		  //					 padding: '10 10 10 10',
		  //					 items: pathItems
		  //				}]
		  //						  
		  //		  }]
		  
		  this.dockedItems = [
		  {
				xtype: 'toolbar',
				dock: 'bottom',
				items: [
				{
					 xtype: 'checkboxfield',
					 fieldLabel: 'Использовать по умолчанию',
					 itemId: 'customPreprocessDefault',
					 checked: PP.Settings.getBool("CustomPreprocessDefault"),
					 labelWidth: 240,
					 boxLabel: ''
				},
				{
					 xtype: 'tbfill'
				},
				{
					 xtype: 'button',
					 itemId: 'customPreprocess',
					 text: 'Препроцессировать'
				}
				]
		  }
		  ]
		  this.callParent(arguments);
	 }
				
				
});