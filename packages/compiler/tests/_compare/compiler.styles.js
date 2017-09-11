return function(_super) {
	_super.childTemplateExtend(Template1040613953);
	function Template1040613953(application, parent)
	{
		_super.call(this, application, parent);
	}
	Template1040613953.prototype.main = function(parent)
	{
		var root = this;
		var tmpl = this;
		root.insertStyleRule(
			".parent-template",
			[
				"color: red;"
			]
		);
		root.insertStyleRule(
			".parent-override",
			[
				"color: green;"
			]
		);
		tmpl.init();
	};
	return Template1040613953;
}