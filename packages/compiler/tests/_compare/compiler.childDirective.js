return function(template, el, component, directivesProvider) {
	var root = template;
	el.addElement("directive", {}, function(el) {
		root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addDirective("@directive_0", directivesProvider.getDirectiveTypeByName("TestDirective"), function(directive) {
				component.directive = directive;
			});
		});
	});
}