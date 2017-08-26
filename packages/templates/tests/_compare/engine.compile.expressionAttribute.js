return function(_super)
{
	_super.childTemplateExtend(Template);
	function Template()
	{
		_super.call(this);
	}
	Template.prototype.main = function(parent)
	{
		var root = this;
		parent.addElement("div", {"class": ""}, function(parent) {
			root.getProvider("watcher").watch(["divClass"], function() {return divClass + ' red' + ' highlighted';}, function(value) {parent.nativeElement.setAttribute("class", value);});
		});
	};
	return Template;
};