return function(template, el, component, directivesProvider) {
	var root = template;
	el.addElement("test-child-directive", {}, function(el) {
		root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addDirective("@directive_0", directivesProvider.getDirectiveTypeByName("TestChildDirective"));
		});
		template.getParameter("@directive_0").onInit();
		el.addElement("div");
	});
	el.addElement("test-child-component", {}, function(el) {
		root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addComponent("@directive_1", directivesProvider.getDirectiveTypeByName("TestChildComponent"));
		});
	});
}