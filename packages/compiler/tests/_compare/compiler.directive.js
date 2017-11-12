return function(template, el, component, directivesProvider) {
	var root = template;
	el.addElement("directive", {}, function(el) {
		root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addDirective("@directive_0", directivesProvider.getDirectiveTypeByName("TestChildDirective"));
		});
	});
	el.addElement("my-child", {}, function(el) {
		root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addComponent("@directive_1", directivesProvider.getDirectiveTypeByName("TestChildComponent"));
		});
	});
}