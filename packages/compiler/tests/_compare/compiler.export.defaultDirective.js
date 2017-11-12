return function(template, el, component, directivesProvider) {
	var root = template;
	el.addElement("div", {}, function(el) {
		root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addDirective("@directive_0", directivesProvider.getDirectiveTypeByName("TestDirective"), function(directive) {
				template.setParameter("dir", directive);
			});
		});
	});
	el.addExpression(function() {
		return template.getParameter('dir').text;
	});
}