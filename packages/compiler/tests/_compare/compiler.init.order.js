return function(template, el, component) {
	el.addElement("test-child-directive", {}, function(el) {
		template.root.createDirective(template, el, "@directive_0", 1299043621);
		template.getParameter("@directive_0").onInit();
		el.addElement("div");
	});
	el.addElement("test-child-component", {}, function(el) {
		template.root.createComponent(template, el, "@directive_1", 919497546);
	});
}