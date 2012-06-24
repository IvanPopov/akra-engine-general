function Component (pParent, sName) {
	this._pParent = pParent;
	this._sName = sName;
	this._pTemplate = pParent.findTemplate(sName);

	if (!this._pTemplate) {
		error('component <' + sName + '> must have its own template.');
	}

	if (!this.init(this._pTemplate)) {
		error('cannot init component: <' + sName + '>');
	}
}

Component.prototype.init = function() {
	return false;
};

Component.prototype.show = function(pData) {
	return this._pTemplate.compile(pData);
};

A_NAMESPACE(Component, ui);