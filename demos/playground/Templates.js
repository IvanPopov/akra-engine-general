A_DEFINE_NAMESPACE(tpl, IDE);
A_DEFINE_NAMESPACE(ui);

Include('./ui/');

function Template (pData) {
	this.sName = 'unknown';
	this.pProperties = {};
	this.sData = '';

	this.construct(pData);
}

Template.prototype.construct = function(pData) {
	for (var i = 0; i < pData.attributes.length; ++ i) {
		var pAttr = pData.attributes[i];
		this.pProperties[pAttr.name] = pAttr.value;
	}

	this.sName = this.pProperties['name'];
	this.sData = pData.innerHTML;
};

Template.prototype.compile = function(pData) {
	var pCompiled = {};
	for (var i in pProperties) {
		if (pProperties.match(/^\{$[^]\}$/ig)) {

		}
	}
	return pCompiled;
};

A_NAMESPACE(Template, ui);

function TemplateParser (pParent) {
	this._pParent = pParent;
	this._pTemplates = {};
	this._pNamespace = [];
}

PROPERTY(TemplateParser, 'namespace',
	function () {
		return this._pNamespace.join('::');
	},
	function (sNamespace) {
		if (sNamespace) {
			this._pNamespace.push(sNamespace);
		}
		else {
			this._pNamespace.pop();
		}
	});

TemplateParser.prototype.getTemplate = function(sName) {
	return this._pTemplates[sName];
};

TemplateParser.prototype.load = function(sPath) {
	var sUrl = A_IDE['temaplates']['path'] + sPath;
	//var me = this;

	var sData = a.ajax({url: sUrl, async: false}).data;
	this.parse(a.toDOM(sData, false));
};

TemplateParser.prototype.parse = function() {
	var pNodes = arguments[0] instanceof NodeList? 
		arguments[0]: arguments[0].childNodes;

	for (var i = 0; i < pNodes.length; i++) {
		switch (pNodes[i].nodeName) {
			case 'NAMESPACE':
				this.parseNamespace(pNodes[i]);
				break;
			case 'DIALOG':
				this.addTemplate(pNodes[i]);
				break;
			default:
				trace('TemplateParser:: unknown node found:', pNodes[i]);
		}
	};
};

TemplateParser.prototype.addTemplate = function(pData) {
	var pTemplates = this._pTemplates;
	var pTemplate = new a.ui.Template(pData);

	pTemplates[this.namespace + '::' + pTemplate.sName] = pTemplate;
};

TemplateParser.prototype.parseNamespace = function(pNode) {
	var sNamespace = pNode.attributes.name.value || null;
	if (sNamespace) {
		this.namespace = sNamespace;
		this.parse(pNode.childNodes);
		this.namespace = null;
	}		
};


A_NAMESPACE(TemplateParser, ui);