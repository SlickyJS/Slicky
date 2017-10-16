return function(template, el, component) {
	el.addElement("div", {}, function(el) {
		template.root.createDirective(template, el, "@directive_0", 3439871838, function(directive) {
			template.setParameter("dirA", directive);
		});
		template.root.createDirective(template, el, "@directive_1", 1577920381, function(directive) {
			template.setParameter("dirB", directive);
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