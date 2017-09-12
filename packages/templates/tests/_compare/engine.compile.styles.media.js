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
		root.insertStyleRule("@media screen {[__slicky_style__0] {color: red}}");
		tmpl._appendElement(parent, "span", {"__slicky_style__0": ""});
		tmpl.init();
	};
	return Template;
}