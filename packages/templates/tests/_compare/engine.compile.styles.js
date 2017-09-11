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
		root.insertStyleRule(
			"button",
			[
				"color: red;",
				"background-color: blue !important;"
			]
		);
		root.insertStyleRule(
			"p",
			[
				"line-spacing: 1.6em;"
			]
		);
		tmpl.init();
	};
	return Template;
}