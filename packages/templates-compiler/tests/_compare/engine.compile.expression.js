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
		tmpl._appendText(parent, "", function(text) {
			tmpl.getProvider("watcher").watch(function() {
				return tmpl.getParameter('a');
			}, function(value) {
				text.nodeValue = value;
			});
		});
		tmpl.init();
	};
	return Template;
}