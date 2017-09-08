return function(_super) {
	_super.childTemplateExtend(Template338502802);
	function Template338502802(application, parent)
	{
		_super.call(this, application, parent);
	}
	Template338502802.prototype.main = function(parent)
	{
		var root = this;
		var tmpl = this;
		tmpl._appendElement(parent, "directive", {}, function(parent) {
			root.getProvider("directivesProvider").create(1776634003, parent, root.getProvider("container"), [], function(directive) {
				tmpl.addProvider("directiveInstance-0", directive);
				root.getProvider("component").directives.add.emit(directive);
				tmpl.onDestroy(function() {
					tmpl.removeProvider("directiveInstance-0");
					root.getProvider("component").directives.remove.emit(directive);
				});
			});
		});
		tmpl.init();
	};
	return Template338502802;
}