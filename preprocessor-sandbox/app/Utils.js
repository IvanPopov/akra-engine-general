Ext.define('PP.Utils', {
	 singleton: false,
	 timestamp: function(){
		  return (new Date()).getTime();
	 },
	 msg : function(title, format){
		  function createBox(t, s){
				return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
		  }
		  if(!this.msgCt){
				this.msgCt = Ext.DomHelper.insertFirst(document.body, {
					 id:'msg-div'
				}, true);
		  }
		  var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
		  var m = Ext.DomHelper.append(this.msgCt, createBox(title, s), true);
		  m.hide();
		  m.slideIn('t').ghost("t", {
				delay: 1000, 
				remove: true
		  });
	 },
	 
	 msgCt: null
	 
});