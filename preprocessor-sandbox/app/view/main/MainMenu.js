Ext.define('PP.view.main.MainMenu', {
	 alias: 'widget.mainmenu',
	 extend: 'Ext.toolbar.Toolbar',
	 
	 dock: 'top',

	 initComponent: function() {
		  //console.log(PP.Settings.getBool("HighliteCheckBox"));
		  this.items = [
		  {
				xtype: 'splitbutton',
				itemId: 'preprocess',
				text: 'Препроцессировать',
				menu: {
					 xtype: 'menu',
					 showSeparator: false,
					 items: [
					 {
						  xtype: 'menuitem',
						  itemId: 'customPreprocess',
						  text: 'Выборочно'
					 }
					 ]
				}
		  },{
				xtype:    'button',
				itemId:   'execute',
				text:     'Запустить',
				disabled: true
		  },{
				xtype:    'splitbutton',
				itemId:   'extractMacros',
				text:     'Извлечь макросы',
				menu: {
					 xtype: 'menu',
					 margin: '',
					 items: [
					 {
						  xtype:   'menuitem',
						  text:    'В виде шаблона',
						  itemId:  'extractMacrosAsTemplate'
					 }]
				}
		  },{
				xtype:  'button',
				itemId: 'debug',
				text:   'Отладка',
				disabled: true
		  },{
				xtype: 'button',
				text:  'Настройки',
				menu: {
					 xtype: 'menu',
					 margin: '',
					 items: [
					 {
						  xtype:   'menucheckitem',
						  text:    'Debug mode',
						  itemId:  'debugOnOff',
						  checked: PP.Settings.getBool("DebugModeCheckBox")
					 },
					 {
						  xtype:    'menucheckitem',
						  text:     'Auto format',
						  itemId:   'autoformatOnOff',
						  disabled: PP.Settings.getBool("HighliteCheckBox") ? false : true,
						  checked:  (PP.Settings.getBool("AutoformatCheckBox") && PP.Settings.getBool("HighliteCheckBox"))
					 },
					 {
						  xtype:  'menucheckitem',
						  text:   'Highlite',
						  itemId: 'highliteOnOff',
						  checked: PP.Settings.getBool("HighliteCheckBox")
					 },
					 {
						  xtype:  'menuitem',
						  itemId: 'applicationSettingsBtn',
						  text:   'Параметры'
					 }
					 ]
				}
		  },{
				xtype:       'cycle',
				showText:    true,
				id:          'viewType',
				prependText: 'Вид: ',
				menu: {
					 items: [{
						  text:    'владки',
						  iconCls: 'view-html',
						  checked: PP.Settings.eq("PanelLayout", "LayoutTab")
					 },{
						  text:    'колонки',
						  iconCls: 'view-html',
						  checked: PP.Settings.eq("PanelLayout", "LayoutColumn")
					 }]
				}
		  },{
				xtype: 'button',
				id:    'canvasBtn',
				text:  'Canvas'
		  },{
				xtype: 'button',
				id:    'helpBtn',
				text:  'Помощь'
		  }
		  ];
 
		  this.callParent(arguments);
	 }
});