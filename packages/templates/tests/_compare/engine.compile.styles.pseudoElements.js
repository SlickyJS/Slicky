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
		root.insertStyleRule("[__slicky_style__2]::before {font-weight: bold}");
		root.insertStyleRule("[__slicky_style__0]::after, [__slicky_style__0]::before {color: blue}");
		tmpl._appendElement(parent, "span", {"__slicky_style__0": ""}, function(parent) {
			tmpl._appendElement(parent, "i", {"__slicky_style__2": ""});
		});
		tmpl._appendElement(parent, "div", {"__slicky_style__0": ""});
		tmpl.init();
	};
	return Template;
}