return function(template, el, component, directivesProvider) {
	template.declareTemplate("@template_0", function(template, el) {
		el.addElement("directive", {}, function(el) {
			template.root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
				template.addDirective("@directive_0", directivesProvider.getDirectiveTypeByName("TestDirective"));
			});
		});
	});
}