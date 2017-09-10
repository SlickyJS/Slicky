return function(_super) {
	_super.childTemplateExtend(Template2782637941);
	function Template2782637941(application, parent)
	{
		_super.call(this, application, parent);
	}
	Template2782637941.prototype.main = function(parent)
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
	return Template2782637941;
}