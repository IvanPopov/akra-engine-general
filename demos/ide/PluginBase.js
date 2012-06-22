function PluginBase(pMain) {
	debug_assert(pMain, 'you must specify ide core');

	this._pMain = pMain;
}

PROPERTY(PluginBase, 'menu',
	function () {
		return null;
	});

PluginBase.prototype.connect = function(pTarget, eEvent, fnHandler) {
	
};


A_NAMESPACE(PluginBase, IDE);