Ext.define('PP.Settings', {
	 singleton: false,
	 get: function(settingName, type){
		  switch(type){
				case "int":
					 return Ext.util.Cookies.get(settingName) ? parseInt(Ext.util.Cookies.get(settingName)) : this.defaults[settingName];
					 break;
				case "float":
					 return Ext.util.Cookies.get(settingName) ? parseFloat(Ext.util.Cookies.get(settingName)) : this.defaults[settingName];
					 break;
				case "bool":
					 var value = Ext.util.Cookies.get(settingName);
					 if(value == "true")
						  return true;
					 else if(value == "false")
						  return false;
					 else
						  return  this.defaults[settingName];
					 break;
				case "json":
					 return Ext.util.Cookies.get(settingName) ? JSON.parse((Ext.util.Cookies.get(settingName))) : this.defaults[settingName];
					 break;
				default:
					 return Ext.util.Cookies.get(settingName) ? Ext.util.Cookies.get(settingName) : this.defaults[settingName];
					 break;
		  }
	 },
	 getBool: function(settingName){
		  return this.get(settingName, "bool")
	 },
	 getInt: function(settingName){
		  return this.get(settingName, "int")
	 },
	 getFloat: function(settingName){
		  return this.get(settingName, "float")
	 },
	 getJson: function(settingName){
		  return this.get(settingName, "json")
	 },
	 eq: function(settingName, testValue){
		  if(this.get(settingName) == testValue)
				return true;
		  else
				return false;
	 },
	 set: function(settingName, value){
		  Ext.util.Cookies.set(settingName, value);
	 },
	 setJson: function(settingName, value){
		  Ext.util.Cookies.set(settingName, JSON.stringify(value));
	 },
	 
	 defaults: {
		  //Canvas
		  "CanvasWidth"    : 200,
		  "CanvasHeight"   : 200,
		  "ConvasId"       : 'defaultId',
		  "ConvasOpened"   : false,
		  "CanvasPositionY": undefined,
		  "CanvasPositionX": undefined,
		  //Menu
		  "DebugModeCheckBox" : false,
		  "HighliteCheckBox"  : true,
		  "AutoformatCheckBox": false,
		  //Panel Layout
		  "PanelLayout": "LayoutColumn",
		  //Preprocessor help
		  "PreprocHelpOpened"         : false,
		  "PreprocHelpWindowPositionX": 1000,
		  "PreprocHelpWindowPositionY": 0,
		  "PreprocHelpWindowWidth"    : 600,
		  "PreprocHelpWindowHeight"   : 350,
		  //Custom Preprocess
		  "CustomPreprocessOptions": {},
		  "CustomPreprocessWidth"    : 200,
		  "CustomPreprocessHeight"   : 200,
		  "CustomPreprocessPositionY": undefined,
		  "CustomPreprocessPositionX": undefined,
		  "CustomPreprocessDefault"  : false,
		  //Code
		  "RawCode": "",
		  //Settings
		  "ApplicationSetingsOpened"   : false,
		  "ApplicationSetingsWidth"    : 600,
		  "ApplicationSetingsHeight"   : 400,
		  "ApplicationSetingsPositionX": undefined,
		  "ApplicationSetingsPositionY": undefined
		  
	 }
});