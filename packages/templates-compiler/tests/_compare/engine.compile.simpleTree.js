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
		tmpl._appendElement(parent, "div", {}, function(parent) {
			tmpl._appendElement(parent, "span", {}, function(parent) {
				tmpl._appendText(parent, "Hello ");
				tmpl._appendElement(parent, "i", {}, function(parent) {
					tmpl._appendText(parent, "world");
				});
			});
		});
		tmpl.init();
	};
	return Template;
}