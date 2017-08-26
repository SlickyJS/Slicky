return function(_super)
{
	_super.childTemplateExtend(Template);
	function Template()
	{
		_super.call(this);
	}
	Template.prototype.main = function(parent)
	{
		parent.addElement("div", {}, function(parent) {
			parent.addElement("span", {}, function(parent) {
				parent.addText("Hello ");
				parent.addElement("i", {}, function(parent) {
					parent.addText("world");
				});
			});
		});
	};
	return Template;
};