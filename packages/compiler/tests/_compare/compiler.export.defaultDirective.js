return function(template, el, component) {
	el.addElement("div", {}, function(el) {
		template.root.createDirective(template, el, "@directive_0", 2439931071, function(directive) {
			template.setParameter("dir", directive);
		});
	});
	el.addExpression(function() {
		return template.getParameter('dir').text;
	});
}