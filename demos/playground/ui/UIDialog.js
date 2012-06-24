goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.Dialog');

function Dialog() {
	A_CLASS;
}

EXTENDS(Dialog, a.ui.Component);

Dialog.prototype.init = function(pTpl) {
    this._pData = new goog.ui.Dialog();
    return true;
};

Dialog.prototype.show = function () {
	parent.show();

	var pDialog = this._pData;
	var pData = this.params();

	pDialog.setTitle(pData['title']);
    pDialog.setContent(pData['content']);
    
    if (pData['buttonset']) {
    	pDialog.setButtonSet(goog.ui.Dialog.ButtonSet[pData['buttonset']]);
    }
	
	pDialog.setVisible(true);
}


A_NAMESPACE(Dialog, ui);