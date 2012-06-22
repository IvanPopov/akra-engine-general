Ext.define('PP.view.canvas.CanvasWindow', {
	 alias: 'widget.canvaswindow',
	 extend: 'Ext.window.Window',
	 title: 'Canvas',
	 closable: true,
	 closeAction: 'destroy',
	 autoShow: true,
	 layout: 'fit',
	 constrain: true,
	 //resizable: false,
	 
	 initComponent: function() {
		  //проставляем каждый раз позицию окна из куки. Эта функция вызывается каждый раз при открытии окна.
		  this.x = PP.Settings.get("CanvasPositionX", "int");
		  this.y = PP.Settings.get("CanvasPositionY", "int");
		  
		  var canvasWidth  = PP.Settings.get("CanvasWidth");
		  var canvasHeight = PP.Settings.get("CanvasHeight");
		  var canvasId     = PP.Settings.get("ConvasId");
		  this.items = [
		  {
				xtype: 'panel',
				resizable: false, 
				layout: 'fit',
				html: "<div id='canvasDiv' style='width: 100%; height: 100%;'><canvas id='" + canvasId + "' width='" + canvasWidth + "' height='" + canvasHeight +"'></canvas></div>"
		  }
		  ];
		  this.callParent(arguments);		
	 }		
});