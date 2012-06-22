Ext.define('PP.controller.Menu', {
	 extend: 'Ext.app.Controller',
	 views: [
		  'main.MainMenu'
	 ],
	 refs: [
		  {selector: 'mainpanel > #tabLayout',    ref: 'tabPanel'},
		  {selector: 'mainpanel > #columnLayout', ref: 'columns'},
		  {selector: 'mainpanel',                 ref: 'mainPanel'},
		  {selector: 'canvaswindow',              ref: 'canvasWindow'},
		  {selector: 'preprochelp',               ref: 'preprocHelp'},
		  {selector: 'customPreprocessWindow',    ref: 'customPreprocessWindow'},
		  {selector: 'settingswindow ',           ref: 'settingsWindow'},
		  {selector: 'viewport toolbar button#preprocess',     ref: 'preprocessBtn'},
		  {selector: 'viewport toolbar button#execute',        ref: 'executeBtn'},
		  {selector: 'viewport toolbar button#debug',          ref: 'debugBtn'},
		  {selector: 'viewport panel#rawCode',                 ref: 'rawCodePanel'},
		  {selector: 'viewport textareafield#rawCode',         ref: 'rawCode'},
		  {selector: 'viewport panel#preprocessedCode',        ref: 'preprocessedCodePanel'},
		  {selector: 'viewport textareafield#preprocessedCode',ref: 'preprocessedCode'}
	 ],
	 init: function() {
		  this.control({
				'viewport #viewType': {
					 change: this.onViewTypeChange
				},
				'viewport #helpBtn': {
					 click: this.onHelpBtnClick
				},
				'viewport #canvasBtn': {
					 click: this.onCanvasBtnClick
				},
				'viewport #applicationSettingsBtn': {
					 click: this.onApplicationSettingsBtnClick
				},
				'canvaswindow': {
					 destroy: this.onCanvasDestroy
				},
				'preprochelp': {
					 destroy: this.onPreprocHelpDestroy
				},
				
				'customPreprocessWindow': {
					 destroy: this.customPreprocessWindowDestroy
				},
				'settingswindow': {
					 destroy: this.onApplicationSettingsDestroy
				},
				'viewport menuitem#customPreprocess': {
					 click: this.customPreprocessWindowCreate
				}
		  });
		  if(PP.Settings.getBool("ConvasOpened"))
				this.onCanvasBtnClick();
		  if(PP.Settings.getBool("PreprocHelpOpened"))
				this.onHelpBtnClick();
		  if(PP.Settings.getBool("ApplicationSetingsOpened"))
				this.onApplicationSettingsBtnClick();
		  if(PP.Settings.getBool("CustomPreprocessOpened"))
				this.customPreprocessWindowCreate();
	 },
	 
	 onViewTypeChange: function(button, item, eOpts){
		  var executeBtnState = this.getExecuteBtn().disabled;
		  var debugBtnState   = this.getDebugBtn().disabled;
		  var rawCode      = window.editorSource.getValue();
		  var rawCodeTitle = this.getRawCodePanel().title;
		  var preprocessedCode      = (window.editorCode) ? window.editorCode.getValue() : this.getPreprocessedCode().getValue();
		  var preprocessedCodeTitle = this.getPreprocessedCodePanel().title;
		  
		  if(item.itemIndex == 1){
				PP.Settings.set("PanelLayout", "LayoutColumn");
				//console.log("column remove")
				this.getMainPanel().remove(this.getTabPanel());
				this.getMainPanel().add({
					 xtype: 'columnlayout'
				});
		  }else if(item.itemIndex == 0){
				PP.Settings.set("PanelLayout", "LayoutTab");
				//console.log("tab remove")
				this.getMainPanel().remove(this.getColumns());
				this.getMainPanel().add({
					 xtype: 'tablayout'
				});
		  }
		  this.getController('Preprocessor').rawCodeForceChange(rawCode, rawCodeTitle);
		  this.getController('Preprocessor').preprocessedCodeForceChange(preprocessedCode, preprocessedCodeTitle);
		  if(!executeBtnState)
				this.getExecuteBtn().enable()
		  if(!debugBtnState)
				this.getDebugBtn().enable()
	 },
	 onHelpBtnClick: function(){
		  
		  if(this.helpOpened){
				this.getPreprocHelp().show();
		  }else{
				Ext.create('widget.preprochelp');
				PP.Settings.set("PreprocHelpOpened", true);
				this.helpOpened = true;
		  }
	 },
	 onCanvasBtnClick: function(){
		  if(this.canvasOpened){
				this.getCanvasWindow().show();
		  }else{
				Ext.create('widget.canvaswindow');
				PP.Settings.set("ConvasOpened", true);
				this.canvasOpened = true;
		  }
	 },
	 onApplicationSettingsBtnClick: function(){
		  console.log("opened clicked");
		  if(this.applicationSetingsOpened){
				this.getSettingsWindow().show();
		  }else{
				Ext.create('widget.settingswindow');
				PP.Settings.set("ApplicationSetingsOpened", true);
				this.applicationSetingsOpened = true;
		  }
	 },
	 onCanvasDestroy: function(){
		  PP.Settings.set("ConvasOpened", false);
		  this.canvasOpened = false;
	 },
	 onPreprocHelpDestroy: function(){
		  PP.Settings.set("PreprocHelpOpened", false);
		  this.helpOpened = false;
	 },
	 onApplicationSettingsDestroy: function(){
		  PP.Settings.set("ApplicationSetingsOpened", false);
		  this.applicationSetingsOpened = false;
	 },
	 customPreprocessWindowCreate: function(){
		  if(this.customPreprocessOpened){
				this.getCustomPreprocessWindow().show();
		  }else{
				Ext.create('widget.customPreprocessWindow');
				PP.Settings.set("CustomPreprocessOpened", true);
				this.customPreprocessOpened = true;
		  }
	 },
	 customPreprocessWindowDestroy: function(){
		  PP.Settings.set("CustomPreprocessOpened", false);
		  this.customPreprocessOpened = false;
	 },
	 
	 canvasOpened: false,
	 helpOpened: false,
	 customPreprocessOpened: false,
	 applicationSetingsOpened: false
	 
});