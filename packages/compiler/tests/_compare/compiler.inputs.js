return function(_super) {
	_super.childTemplateExtend(Template4111899948);
	function Template4111899948(application, parent)
	{
		_super.call(this, application, parent);
	}
	Template4111899948.prototype.main = function(parent)
	{
		var root = this;
		var tmpl = this;
		tmpl._appendElement(parent, "directive-child", {}, function(parent) {
			root.getProvider("directivesProvider").create(3055171198, parent, root.getProvider("container"), [], function(directive) {
				tmpl.addProvider("directiveInstance-0", directive);
				directive.attributeInput = "attr";
				directive.attributeInputCustom = "custom";
				tmpl.getProvider("watcher").watch(function() {
					return (null);
				}, function(value) {
					directive.attributeInputWatch = value;
				});
				tmpl.getProvider("watcher").watch(function() {
					return true;
				}, function(value) {
					directive.propertyInput = value;
				});
				tmpl.getProvider("watcher").watch(function() {
					return false;
				}, function(value) {
					directive.propertyInputCustom = value;
				});
				tmpl.onDestroy(function() {
					tmpl.removeProvider("directiveInstance-0");
				});
			});
		});
		tmpl._appendElement(parent, "component-child", {}, function(parent) {
			root.getProvider("templatesProvider").createFrom(3385287998, parent, tmpl, function(tmpl, directive) {
				directive.attributeInput = "attr";
				directive.attributeInputCustom = "custom";
				tmpl.parent.getProvider("watcher").watch(function() {
					return (null);
				}, function(value) {
					directive.attributeInputWatch = value;
					tmpl.refresh();
				});
				tmpl.parent.getProvider("watcher").watch(function() {
					return true;
				}, function(value) {
					directive.propertyInput = value;
					tmpl.refresh();
				});
				tmpl.parent.getProvider("watcher").watch(function() {
					return false;
				}, function(value) {
					directive.propertyInputCustom = value;
					tmpl.refresh();
				});
				tmpl.render(parent);
			});
		});
		tmpl.init();
	};
	return Template4111899948;
}