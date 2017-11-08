return function(template, el, component, directivesProvider) {
	el.addElement("child-component", {}, function(el) {
		template.root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addComponent("@directive_0", directivesProvider.getDirectiveTypeByName("TestChildDirective"), function(directive, template, outer) {
				outer.setParameter("child", directive);
			});
		});
	});
	el.addExpression(function() {
		return template.getParameter('child').innerText;
	});
}