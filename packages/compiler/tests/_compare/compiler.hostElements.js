return function(template, el, component, directivesProvider) {
	el.addElement("test-directive", {}, function(el) {
		template.root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addDirective("@directive_0", directivesProvider.getDirectiveTypeByName("TestDirective"));
		});
		el.addElement("span", {}, function(el) {
			template.getParameter("@directive_0").el = el._nativeNode;
		});
	});
	el.addElement("i", {}, function(el) {
		component.el = el._nativeNode;
	});
}