goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.Dialog');

function Dialog() {
	A_CLASS;

	this._pData = new goog.ui.Dialog();
}

EXTENDS(Dialog, a.ui.Component);

Dialog.prototype.show = function (pData) {
	var pDialog = this._pData;

	//pDialog.setTitle();
    //pDialog.setContent();
    
    // if (pData['buttonset']) {
    // 	pDialog.setButtonSet(goog.ui.Dialog.ButtonSet[pData['buttonset']]);
    // }
	
	pDialog.setContent(this.template(pData))
	pDialog.setVisible(true);
}


A_NAMESPACE(Dialog, ui);