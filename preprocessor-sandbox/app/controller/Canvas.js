Ext.define('PP.controller.Canvas', {
	 extend: 'Ext.app.Controller',
	 views: [
		  'canvas.CanvasWindow'
	 ],	
	 refs: [
		  {selector: 'canvaswindow #canvasDiv',   ref: 'canvasDiv'},
		  {selector: 'canvaswindow panel',        ref: 'canvasPanel'},
		  {selector: 'canvaswindow #canvasIdLabel',ref: 'canvasIdLabel'}
		  
	 ],
	 init: function() {
		  this.control({
				'canvaswindow': {
					 move:   this.onWindowMove,
					 resize: this.onWindowResize
				}
		  });
	 },
	 onWindowMove: function(e, x, y){
		  PP.Settings.set("CanvasPositionX", x);
		  PP.Settings.set("CanvasPositionY", y);
	 },
	 onWindowResize: function(){
		  var canvasDivWidth  = Ext.get("canvasDiv").getWidth();
		  var canvasDivHeight = Ext.get("canvasDiv").getHeight();
		  Ext.get(PP.Settings.get("ConvasId")).setSize(canvasDivWidth, canvasDivHeight);
		  PP.Settings.set("CanvasWidth",  canvasDivWidth)
		  PP.Settings.set("CanvasHeight", canvasDivHeight)
		  //console.log(this.getCanvasIdLabel());
	 }
});