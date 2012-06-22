Ext.define('PP.controller.Preprocessor', {
	extend: 'Ext.app.Controller',
	views: [
	'main.MainMenu',
	'main.MainPanel',
	'main.RawCode',
	'main.PreprocessedCode',
	'layouts.TabLayout',
	'layouts.ColumnLayout'
	],
	stores: ['PreprocCommands'],
	refs: [
	{
		selector: 'viewport panel#rawCode',                 
		ref: 'rawCodePanel'
	},

	{
		selector: 'viewport textareafield#rawCode',         
		ref: 'rawCode'
	},

	{
		selector: 'viewport panel#preprocessedCode',        
		ref: 'preprocessedCodePanel'
	},

	{
		selector: 'viewport textareafield#preprocessedCode',
		ref: 'preprocessedCode'
	},

	{
		selector: 'viewport toolbar button#preprocess',     
		ref: 'preprocessBtn'
	},

	{
		selector: 'viewport toolbar button#execute',        
		ref: 'executeBtn'
	},

	{
		selector: 'viewport toolbar button#debug',          
		ref: 'debugBtn'
	},

	{
		selector: 'viewport menucheckitem#highliteOnOff',   
		ref: 'highliteOnOff'
	},

	{
		selector: 'viewport menucheckitem#autoformatOnOff', 
		ref: 'autoformatOnOff'
	},

	{
		selector: 'viewport menucheckitem#debugOnOff',      
		ref: 'debugOnOff'
	}
	],
	init: function() {
		Ext.QuickTips.init();
		this.control({
			'viewport rawcode textareafield': {
				change: this.onRawCodeChange,
				render: this.onRawCodeRender
			},
			'viewport preprocessedcode textareafield': {
				render: this.onPreprocessedCodeRender,
				change: this.onPreprocessedCodeChange
			},
			'viewport preprocessedcode': {
				show: this.onPreprocessedCodePanelShow
			},
			'viewport toolbar button#preprocess': {
				click: this.onPreprocessClick
			},
			'viewport toolbar button#execute': {
				click: this.onExecClick
			},
			'viewport #debugOnOff': {
				click: this.onDebugChange
			},
			'viewport #highliteOnOff': {
				click: this.onHighliteChange
			},
			'viewport #autoformatOnOff':{
				click: this.onAutoformatChange
			},
			'window actioncolumn':{
				click: this.onAddButtonClick
			},
			'viewport toolbar splitbutton#extractMacros': {
				click: this.onExtractMacrosClick
			},
			'viewport toolbar menuitem#extractMacrosAsTemplate': {
				click: this.onExtractMacrosAsTemplateClick
			}
		});
		  
		Preprocessor.debug = PP.Settings.getBool("DebugModeCheckBox");
	},
	onExtractMacrosClick: function(){
		var code = window.editorSource.getValue();
		code = Preprocessor.extractMacro(code);
		if(this.getHighliteOnOff().checked){
			window.editorCode.setValue(code);
			window.editorCode.refresh();
		}
		else
			this.getPreprocessedCode().setValue(code);
	},
	onExtractMacrosAsTemplateClick: function(){
		console.log(111);
		var code = window.editorSource.getValue();
		code = Preprocessor.extractMacro(
			code, 
			function(name, value){
				return "var " + name + ";"
				}, 
			function(name, args, value){
				return "function " + name + "(" + args + "){}"
				}
			);
		if(this.getHighliteOnOff().checked){
			window.editorCode.setValue(code);
			window.editorCode.refresh();
		}
		else
			this.getPreprocessedCode().setValue(code);
	},
	onAddButtonClick: function(a, b, row, column){
		var preprocCommand = this.getPreprocCommandsStore().getAt(row).get("command");
		var cursorPos = window.editorSource.getCursor()
		var line = window.editorSource.getLine(cursorPos.line)
		var lineStart = line.substr(0, cursorPos.ch);
		var lineEnd =  line.substr(cursorPos.ch);
		window.editorSource.setLine(cursorPos.line, lineStart + preprocCommand + lineEnd)
	},
	onRawCodeRender: function(){
		var me = this;
		  
		window.editorSource = CodeMirror.fromTextArea(Ext.getDom("rawCodeField"), {
			lineNumbers: true,
			matchBrackets: true,
			mode: "javascript",
			onChange: function() {
				me.onRawCodeChange.apply(me, arguments);
			}
		});
		window.editorSource.setValue(PP.Settings.get("RawCode"));
		this.getRawCodePanel().setTitle('Исходный код');
	},
	onRawCodeChange: function(){
		this.getExecuteBtn().disable();
		this.getDebugBtn().disable();
		this.getRawCodePanel().setTitle('Исходный код *');
		PP.Settings.set("RawCode", window.editorSource.getValue());
	},
	rawCodeForceChange: function(code, title){
		window.editorSource.setValue(code);
		this.getRawCodePanel().setTitle(title);
	},
	preprocessedCodeForceChange: function(code, title){
		if(window.editorCode)
			window.editorCode.setValue(code);
		else
			this.getPreprocessedCode().setValue(code)
		this.getPreprocessedCodePanel().setTitle(title);
	},
	onPreprocessedCodeChange: function(){
		this.getPreprocessedCodePanel().setTitle('Препроцессированный код *');
	},
	onPreprocessedCodeRender: function(){
		var me = this;
		if(this.getHighliteOnOff().checked){
			window.editorCode = CodeMirror.fromTextArea(Ext.getDom("preprocessedCodeField"), {
				lineNumbers: true,
				matchBrackets: true,
				mode: "javascript",
				onChange: function() {
					me.onPreprocessedCodeChange.apply(me, arguments);
				}
			});
			//console.log(this)
			window.editorCode.setValue(this.getPreprocessedCode().getValue());
		}else{
			if(window.editorCode){
				var code = window.editorCode.getValue();
				window.editorCode.toTextArea();
				this.getPreprocessedCode().setRawValue(code);
			}
		}
		this.getPreprocessedCodePanel().setTitle('Препроцессированный код');
	},
	onPreprocessedCodePanelShow: function(){
		//Это все написано из за проблем с рендерингом вкладки после препроцессирования
		if(this.getHighliteOnOff().checked){
			window.editorCode.refresh();
		}
	},
	onPreprocessClick: function(a, b, c, calledByAnather){
		this.getRawCodePanel().setTitle('Исходный код');
		try {
			var delta = 0;
			var start = PP.Utils.timestamp();
			if(calledByAnather){
				delta = PP.Utils.delta;
				var options = PP.Settings.getJson("CustomPreprocessOptions");
				var code = Preprocessor.next({
					include: options
				});
					 
			}else if(PP.Settings.getBool("CustomPreprocessDefault")){
				var options = PP.Settings.getJson("CustomPreprocessOptions");
				var source = (window.editorSource) ? window.editorSource.getValue() : PP.Settings.get("RawCode");
				var paths = Preprocessor.code(source, {
					include: true
				}).include;
				for(var path in paths){
					if(options[path] == false)
						paths[path] = false;
				}
				var code = Preprocessor.next({
					include: paths
				});
					 
			}else{
					 
				var code = Preprocessor.code(window.editorSource.getValue()); 
			}
			var end = PP.Utils.timestamp();
			PP.Utils.msg('Time', ((end - start + delta)/1000) + ' sec.');
		}
		catch(e) {
			alert(e.toString());
			console.log(e);
		}

		this.getExecuteBtn().enable();
		this.getDebugBtn().enable();
        
		if(this.getHighliteOnOff().checked){
			window.editorCode.setValue(code);
			window.editorCode.refresh();
		}
		else
			this.getPreprocessedCode().setValue(code);
        
		if (this.getAutoformatOnOff().checked)
			window.editorCode.autoFormatRange({
				ch:0,
				line:0
			}, {
				ch:0,
				line:100000
			});
	},
	onExecClick: function(){
		this.getPreprocessedCodePanel().setTitle('Препроцессированный код');
		var code = (this.getHighliteOnOff().checked) ? window.editorCode.getValue() : this.getPreprocessedCode().getValue();
		try{
			eval(code);
		}catch(e){
			alert(e.toString());
			throw e;
		}
	},
	onDebugChange: function(){
		console.log("Debug")
		if(this.getDebugOnOff().checked)
			Ext.util.Cookies.set("DebugModeCheckBox", true);
		else
			Ext.util.Cookies.set("DebugModeCheckBox", false);
		  
		Preprocessor.debug = this.getDebugOnOff().checked;
	},
	onAutoformatChange: function(){
		console.log("Autoformat")
		if(this.getAutoformatOnOff().ckecked)
			Ext.util.Cookies.set("AutoformatCheckBox", true);
		else
			Ext.util.Cookies.set("AutoformatCheckBox", false);
		  
		  
		if (this.getAutoformatOnOff().ckecked)
			window.editorCode.autoFormatRange({
				ch:0,
				line:0
			}, {
				ch:0,
				line:100000
			});
		else
			window.editorCode.autoFormatRange({
				ch:0,
				line:0
			}, {
				ch:0,
				line:0
			});
	},
	onHighliteChange: function(){
		console.log("highlite")
		if(this.getHighliteOnOff().checked){
			this.getAutoformatOnOff().enable();
			Ext.util.Cookies.set("HighliteCheckBox", true);
		}
		else{
			this.getAutoformatOnOff().disable();
			Ext.util.Cookies.set("HighliteCheckBox", false);
		}
		console.log(this.getHighliteOnOff().checked)	
		this.onPreprocessedCodeRender();
	}
	
});