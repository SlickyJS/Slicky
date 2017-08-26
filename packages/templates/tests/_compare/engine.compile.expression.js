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
		parent.addText("", function(text) {
			root.getProvider("watcher").watch(["a"], function() {return a;}, function(value) {text.nodeValue = value;});
		});
	};
	return Template;
};