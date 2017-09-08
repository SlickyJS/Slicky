return function(_super) {
	_super.childTemplateExtend(Template702218680);
	function Template702218680(application, parent)
	{
		_super.call(this, application, parent);
	}
	Template702218680.prototype.main = function(parent)
	{
		var root = this;
		var tmpl = this;
		tmpl._appendElement(parent, "directive-child", {}, function(parent) {
			root.getProvider("directivesProvider").create(3055171198, parent, root.getProvider("container"), [], function(directive) {
				directive.output.subscribe(function($value) {
					root.run(function() {
						root.getProvider('component').do();
					});
				});
				directive.outputCustom.subscribe(function($value) {
					root.run(function() {
						root.getProvider('component').doOther();
					});
				});
			});
		});
		tmpl._appendElement(parent, "component-child", {}, function(parent) {
			root.getProvider("templatesProvider").createFrom(3385287998, parent, tmpl, function(tmpl, directive) {
				directive.output.subscribe(function($value) {
					root.run(function() {
						root.getProvider('component').do();
					});
				});
				directive.outputCustomName.subscribe(function($value) {
					root.run(function() {
						root.getProvider('component').doOther();
					});
				});
				tmpl.render(parent);
			});
		});
		tmpl.init();
	};
	return Template702218680;
}