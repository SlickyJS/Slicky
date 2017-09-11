return function(_super) {
	_super.childTemplateExtend(Template3111496796);
	function Template3111496796(application, parent)
	{
		_super.call(this, application, parent);
	}
	Template3111496796.prototype.main = function(parent)
	{
		var root = this;
		var tmpl = this;
		parent = root.createShadowDOM(parent);
		tmpl.init();
	};
	return Template3111496796;
}