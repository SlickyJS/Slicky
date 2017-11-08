return function(template, el, component, directivesProvider) {
	el.addElement("test-directive", {}, function(el) {
		template.root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addDirective("@directive_0", directivesProvider.getDirectiveTypeByName("TestDirective1"), function(directive) {
				template.watch(function() {
					return component.name;
				}, function(value) {
					directive.name = value;
				});
			});
			template.addDirective("@directive_1", directivesProvider.getDirectiveTypeByName("TestDirective2"), function(directive) {
				template.watch(function() {
					return component.name;
				}, function(value) {
					directive.name = value;
				});
			});
		});
	});
}