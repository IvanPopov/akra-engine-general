function Component (pParent, pTemplate) {
	this._pParent = pParent;
	this._pTemplate = pTemplate;
	trace(pTemplate);
	for (var i in pTemplate) {
		trace(i, pTemplate[i]);
	}
}

Component.prototype.template = function(pData) {
	return this._pTemplate(pData);
};

Component.prototype.show = function() {
};

A_NAMESPACE(Component, ui);