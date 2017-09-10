return function(_super) {
	_super.childTemplateExtend(Template0);
	function Template0(application, parent)
	{
		_super.call(this, application, parent);
	}
	Template0.prototype.main = function(parent)
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
	return Template0;
}