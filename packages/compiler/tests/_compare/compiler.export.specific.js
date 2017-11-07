return function(template, el, component) {
	el.addElement("div", {}, function(el) {
		template.root.createDirectivesStorageTemplate(template, el, function(template) {
			template.addDirective("@directive_0", "3329153248", function(directive) {
				template.setParameter("dirA", directive);
			});
			template.addDirective("@directive_1", "2785014464", function(directive) {
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