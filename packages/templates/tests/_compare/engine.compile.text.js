return function(_super)
{
	_super.childTemplateExtend(Template);
	function Template()
	{
		_super.call(this);
	}
	Template.prototype.main = function(parent)
	{
		parent.addText("hello");
	};
	return Template;
};