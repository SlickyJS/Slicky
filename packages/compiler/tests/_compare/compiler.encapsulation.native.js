return function(_super) {
	_super.childTemplateExtend(Template574069480);
	function Template574069480(application, parent)
	{
		_super.call(this, application, parent);
	}
	Template574069480.prototype.main = function(parent)
	{
		var root = this;
		var tmpl = this;
		parent = root.createShadowDOM(parent);
		tmpl.init();
	};
	return Template574069480;
}