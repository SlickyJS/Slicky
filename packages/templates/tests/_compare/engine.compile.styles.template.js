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
			"div",
			[
				"color: red;"
			]
		);
		tmpl.init();
	};
	return Template;
}