return function(_super) {
	_super.childTemplateExtend(Template619199782);
	function Template619199782(application, parent)
	{
		_super.call(this, application, parent);
	}
	Template619199782.prototype.main = function(parent)
	{
		var root = this;
		var tmpl = this;
		tmpl._appendElement(parent, "directive", {}, function(parent) {
			root.getProvider("directivesProvider").create(1776634003, parent, root.getProvider("container"), [], function(directive) {
				tmpl.addProvider("directiveInstance-0", directive);
				tmpl.onDestroy(function() {
					tmpl.removeProvider("directiveInstance-0");
					directive.onDestroy();
				});
				tmpl.run(function() {
					directive.onInit();
				});
			});
		});
		tmpl.init();
	};
	return Template619199782;
}