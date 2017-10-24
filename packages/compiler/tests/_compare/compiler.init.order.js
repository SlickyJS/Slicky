return function(template, el, component) {
	el.addElement("test-directive", {}, function(el) {
		template.root.createDirective(template, el, "@directive_0", 2518409384);
		el.addElement("div");
		template.getParameter("@directive_0").onInit();
	});
}