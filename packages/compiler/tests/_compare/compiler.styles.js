return function(_super) {
	_super.childTemplateExtend(Template2332923993);
	function Template2332923993(application, parent)
	{
		_super.call(this, application, parent);
	}
	Template2332923993.prototype.main = function(parent)
	{
		var root = this;
		var tmpl = this;
		root.insertStyleRule("[__slicky_style_2332923993_0] {color: red;}");
		root.insertStyleRule("[__slicky_style_2332923993_1] {color: green;}");
		root.insertStyleRule("@media print {[__slicky_style_2332923993_1] {display: none;}}");
		tmpl._appendElement(parent, "div", {"class": "parent-template parent-override", "__slicky_style_2332923993_0": "", "__slicky_style_2332923993_1": ""});
		tmpl.init();
	};
	return Template2332923993;
}