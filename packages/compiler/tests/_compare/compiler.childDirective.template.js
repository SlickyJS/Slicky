return function(_super) {
	_super.childTemplateExtend(Template1191991785);
	function Template1191991785(application, parent)
	{
		_super.call(this, application, parent);
	}
	Template1191991785.prototype.main = function(parent)
	{
		var root = this;
		var tmpl = this;
		tmpl._appendComment(parent, "slicky-template");
		tmpl.init();
	};
	Template1191991785.prototype.template0 = function(tmpl, parent, setup)
	{
		var root = this;
		if (setup) {
			setup(tmpl);
		}
		tmpl._insertElementBefore(parent, "directive", {}, function(parent) {
			root.getProvider("directivesProvider").create(1776634003, parent, root.getProvider("container"), [], function(directive) {
				tmpl.addProvider("directiveInstance-0", directive);
				tmpl.onDestroy(function() {
					tmpl.removeProvider("directiveInstance-0");
				});
			});
		});
		tmpl.init();
		return tmpl;
	};
	return Template1191991785;
}