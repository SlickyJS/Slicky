return function(template, el, component, directivesProvider) {
	el.addElement("div", {}, function(el) {
		template.root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addDirective("@directive_0", directivesProvider.getDirectiveTypeByName("TestDirective"), function(directive) {
				template.setParameter("dir", directive);
			});
		});
	});
	el.addExpression(function() {
		return template.getParameter('dir').text;
	});
}