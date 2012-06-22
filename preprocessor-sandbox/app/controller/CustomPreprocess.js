Ext.define('PP.controller.CustomPreprocess', {
	 extend: 'Ext.app.Controller',
	 views: [
		  'customPreprocess.CustomPreprocessWindow'
	 ],	
	 refs: [
		  {selector: 'customPreprocessWindow',   ref: 'customPreprocessWindow'},
		  {selector: 'customPreprocessWindow #path',   ref: 'paths'},
		  {selector: 'customPreprocessWindow panel',   ref: 'gridPanel'},
		  {selector: 'customPreprocessWindow #customPreprocessDefault',   ref: 'customPreprocessDefault'}
		  
		  
	 ],
	 init: function() {
		  this.control({
				'customPreprocessWindow': {
					 move:   this.onWindowMove,
					 resize: this.onWindowResize
				},
				'customPreprocessWindow button#customPreprocess':{
					 click: this.customPreprocess
				},
				'customPreprocessWindow #customPreprocessDefault':{
					 change: this.customPreprocessDefaultChange
				}
		  });
	 },
	 onWindowMove: function(e, x, y){
		  PP.Settings.set("CustomPreprocessPositionX", x);
		  PP.Settings.set("CustomPreprocessPositionY", y);
	 },
	 onWindowResize: function(e, width, height){
		  PP.Settings.set("CustomPreprocessWidth",  width)
		  PP.Settings.set("CustomPreprocessHeight", height)
	 },
	 customPreprocess: function(){
		  var gridItems = this.getGridPanel().items.items;
		  var paths = {};
		  for(var i = 0; i < gridItems.length; i++){
				if(gridItems[i].xtype == "checkboxfield")
					 paths[gridItems[i].inputValue] = gridItems[i].checked;
		  }
		  PP.Settings.setJson("CustomPreprocessOptions", paths);
		  this.getCustomPreprocessWindow().destroy();
		  this.getController("Preprocessor").onPreprocessClick(null, null, null, true);
	 },
	 customPreprocessDefaultChange: function(){
		  PP.Settings.set("CustomPreprocessDefault", this.getCustomPreprocessDefault().checked);
	 }
});