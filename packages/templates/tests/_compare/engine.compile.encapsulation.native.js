return function(_super) {
	_super.childTemplateExtend(Template);
	function Template(application, parent)
	{
		_super.call(this, application, parent);
	}
	Template.prototype.main = function(parent)
	{
		var root = this;
		var tmpl = this;
		parent = root.createShadowDOM(parent);
		tmpl._appendText(parent, "hello world");
		tmpl.init();
	};
	return Template;
}