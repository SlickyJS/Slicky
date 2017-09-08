return function(_super) {
	_super.childTemplateExtend(Template472405405);
	function Template472405405(application, parent)
	{
		_super.call(this, application, parent);
	}
	Template472405405.prototype.main = function(parent)
	{
		var root = this;
		var tmpl = this;
		tmpl._appendComment(parent, "slicky-template");
		tmpl.init();
	};
	Template472405405.prototype.template0 = function(tmpl, parent, setup)
	{
		var root = this;
		if (setup) {
			setup(tmpl);
		}
		tmpl._insertElementBefore(parent, "directive", {}, function(parent) {
			root.getProvider("directivesProvider").create(1776634003, parent, root.getProvider("container"), [], function(directive) {

			});
		});
		tmpl.init();
		return tmpl;
	};
	return Template472405405;
}