return function(template, el) {
	template.declareTemplate("@template_0", function(template, el) {
		el.addElement("span");
	});
	template.addCondition(function(template, el) {
		return true;
	}, "@template_0");
}