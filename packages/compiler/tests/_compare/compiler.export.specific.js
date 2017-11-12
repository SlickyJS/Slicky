return function(template, el, component, directivesProvider) {
	var root = template;
	el.addElement("div", {}, function(el) {
		root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addDirective("@directive_0", directivesProvider.getDirectiveTypeByName("TestDirectiveA"), function(directive) {
				template.setParameter("dirA", directive);
			});
			template.addDirective("@directive_1", directivesProvider.getDirectiveTypeByName("TestDirectiveB"), function(directive) {
				template.setParameter("dirB", directive);
			});
		});
		template.setParameter("el", el._nativeNode);
	});
	el.addExpression(function() {
		return template.getParameter('el').innerText;
	});
	el.addText(" ");
	el.addExpression(function() {
		return template.getParameter('dirA').name;
	});
	el.addText(" ");
	el.addExpression(function() {
		return template.getParameter('dirB').name;
	});
}