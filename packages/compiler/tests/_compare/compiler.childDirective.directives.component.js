return function(template, el, component, directivesProvider) {
	var root = template;
	el.addElement("parent-directive", {}, function(el) {
		root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addDirective("@directive_0", directivesProvider.getDirectiveTypeByName("TestParentDirective"));
		});
		el.addElement("child-component", {}, function(el) {
			root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
				template.addComponent("@directive_1", directivesProvider.getDirectiveTypeByName("TestChildComponent"), function(directive, template, outer) {
					template.getParameter("@directive_0").directive = directive;
				});
			});
		});
	});
}