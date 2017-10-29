return function(template, el, component) {
	template.run(function() {
		component.onInit();
	});
	el.addElement("test-directive", {}, function(el) {
		template.root.createDirective(template, el, "@directive_0", "2518409384");
		template.getParameter("@directive_0").onInit();
		el.addElement("div");
		template.getParameter("@directive_0").onTemplateInit();
	});
	template.run(function() {
		component.onTemplateInit();
	});
}