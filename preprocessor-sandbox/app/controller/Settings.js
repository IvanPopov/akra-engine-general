Ext.define('PP.controller.Settings', {
	 extend: 'Ext.app.Controller',
	 views: [
		  'settings.SettingsWindow',
		  'settings.SettingsPanel',
		  'settings.CanvasSettingsPanel',
		  'settings.AdditionalSettingsPanel'
	 ],
	 refs: [
		  {selector: 'settingspanel canvassettingspanel #widthField',    ref: 'canvasWidth'},
		  {selector: 'settingspanel canvassettingspanel #heightField',   ref: 'canvasHeight'},
		  {selector: 'settingspanel canvassettingspanel #canvasIdField', ref: 'canvasId'},
		  {selector: 'settingswindow ', ref: 'settingsWindow'}
	 ],
	 init: function() {
		  this.control({
				'settingswindow settingspanel button#saveBtn': {
					 click: this.onSaveBtnClick
				},
				'settingswindow settingspanel button#closeBtn': {
					 click: this.onCloseBtnClick
				},
				'settingswindow': {
					 move: this.onWindowMove,
					 resize: this.onWindowResize
				}
		  });
	 },
	 onSaveBtnClick: function(){
		  PP.Settings.set("CanvasWidth", this.getCanvasWidth().getValue())
		  PP.Settings.set("CanvasHeight", this.getCanvasHeight().getValue())
		  PP.Settings.set("ConvasId", this.getCanvasId().getValue())
	 },
	 onCloseBtnClick: function(){
		  this.getSettingsWindow().destroy()
	 },
	 onWindowMove: function(e, x, y){
		  PP.Settings.set("ApplicationSetingsPositionX", x);
		  PP.Settings.set("ApplicationSetingsPositionY", y);
	 },
	 onWindowResize: function(e, width, height){
		  PP.Settings.set("ApplicationSetingsWidth", width);
		  PP.Settings.set("ApplicationSetingsHeight", height);
	 }
});