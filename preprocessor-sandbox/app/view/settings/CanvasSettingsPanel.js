Ext.define('PP.view.settings.CanvasSettingsPanel', {
	 alias: 'widget.canvassettingspanel',
	 extend: 'Ext.panel.Panel',
	 layout: {
		  type: 'auto'
	 },
	 padding: 15,
	 title: 'Canvas',
	 initComponent: function() {
		  this.items = [
		  {
				xtype: 'numberfield',
				itemId: 'widthField',
				minText: 'Минимальное значение 1',
				minValue: 1,
				allowBlank: false,
				blankText: 'Введите ширину',
				value: PP.Settings.getInt("CanvasWidth"),
				fieldLabel: 'Ширина'
		  },
		  {
				xtype: 'numberfield',
				itemId: 'heightField',
				minText: 'Минимальное значение 1',
				minValue: 1,
				allowBlank: false,
				blankText: 'Введите высоту',
				value: PP.Settings.getInt("CanvasHeight"),
				fieldLabel: 'Высота'
		  },
		  {
				xtype: 'textfield',
				itemId: 'canvasIdField',
				fieldLabel: 'ID',
				allowBlank: false,
				value: PP.Settings.get("ConvasId"),
				blankText: 'Введите id canvas'
		  }
		  ]
 
		  this.callParent(arguments);
	 }
});