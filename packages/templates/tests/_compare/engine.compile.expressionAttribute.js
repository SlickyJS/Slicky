return function(_super) {
	_super.childTemplateExtend(Template0);
	function Template0(application, parent)
	{
		_super.call(this, application, parent);
	}
	Template0.prototype.main = function(parent)
	{
		var root = this;
		var tmpl = this;
		tmpl._appendElement(parent, "div", {"class": ""}, function(parent) {
			tmpl.getProvider("watcher").watch(function() {
				return (tmpl.getParameter('divClass') + ' red') + ' highlighted';
			}, function(value) {
				parent.setAttribute("class", value);
			});
		});
		tmpl.init();
	};
	return Template0;
}