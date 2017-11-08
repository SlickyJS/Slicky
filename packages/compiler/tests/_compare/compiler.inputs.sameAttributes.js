return function(template, el, component, directivesProvider) {
	el.addElement("test-directive", {"name": "David"}, function(el) {
		template.root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addDirective("@directive_0", directivesProvider.getDirectiveTypeByName("TestDirective1"), function(directive) {
				directive.name = "David";
			});
			template.addDirective("@directive_1", directivesProvider.getDirectiveTypeByName("TestDirective2"), function(directive) {
				directive.name = "David";
			});
		});
	});
}