return function(template, el, component, directivesProvider) {
	var root = template;
	template.run(function() {
		component.onInit();
	});
	el.addElement("test-directive", {}, function(el) {
		root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addDirective("@directive_0", directivesProvider.getDirectiveTypeByName("TestDirective"));
		});
		template.getParameter("@directive_0").onInit();
		el.addElement("div");
		template.getParameter("@directive_0").onTemplateInit();
	});
	template.run(function() {
		component.onTemplateInit();
	});
}