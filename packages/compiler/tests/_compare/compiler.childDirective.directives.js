return function(template, el, component, directivesProvider) {
	var root = template;
	el.addElement("parent-directive", {}, function(el) {
		root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addDirective("@directive_0", directivesProvider.getDirectiveTypeByName("TestParentDirective"));
		});
		el.addElement("child-directive", {}, function(el) {
			root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
				template.addDirective("@directive_1", directivesProvider.getDirectiveTypeByName("TestChildDirective"), function(directive) {
					template.getParameter("@directive_0").directive = directive;
				});
			});
		});
	});
}