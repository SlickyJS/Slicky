return function(_super) {
	_super.childTemplateExtend(Template73490630);
	function Template73490630(application, parent)
	{
		_super.call(this, application, parent);
	}
	Template73490630.prototype.main = function(parent)
	{
		var root = this;
		var tmpl = this;
		tmpl._appendElement(parent, "test-directive", {}, function(parent) {
			root.getProvider("directivesProvider").create(2518409384, parent, root.getProvider("container"), [], function(directive) {
				tmpl.addProvider("directiveInstance-0", directive);
				tmpl.onDestroy(function() {
					tmpl.removeProvider("directiveInstance-0");
				});
			});
			tmpl._appendElement(parent, "span", {}, function(parent) {
				tmpl.getProvider("directiveInstance-0").el = parent;
			});
		});
		tmpl._appendElement(parent, "i", {}, function(parent) {
			root.getProvider("component").el = parent;
		});
		tmpl.init();
	};
	return Template73490630;
}