return function(template, el) {
	template.declareTemplate("@template_0", function(template, el) {
		el.addElement("li");
	});
	template.addLoop({iterator: "$iterator", value: "item"}, function(template, el) {
		return template.getParameter('items');
	}, "@template_0", template.getParameter('trackBy'));
}