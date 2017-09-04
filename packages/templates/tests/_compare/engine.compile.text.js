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
		tmpl._appendText(parent, "hello");
		tmpl.init();
	};
	return Template0;
}