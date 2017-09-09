return function(_super) {
	_super.childTemplateExtend(Template1413734749);
	function Template1413734749(application, parent)
	{
		_super.call(this, application, parent);
	}
	Template1413734749.prototype.main = function(parent)
	{
		var root = this;
		var tmpl = this;
		tmpl._appendElement(parent, "directive", {}, function(parent) {
			root.getProvider("directivesProvider").create(1776634003, parent, root.getProvider("container"), [], function(directive) {
				tmpl.addProvider("directiveInstance-0", directive);
				tmpl.onDestroy(function() {
					tmpl.removeProvider("directiveInstance-0");
				});
			});
			tmpl._appendElement(parent, "button", {}, function(parent) {
				tmpl._addElementEventListener(parent, "click", function($event) {
					tmpl.getProvider("directiveInstance-0").onClickButton($event);
				});
			});
		});
		tmpl.init();
	};
	return Template1413734749;
}