return function(template, el, component) {
	el.addElement("child-component", {}, function(el) {
		template.root.createComponent(template, el, "@directive_0", 2994483046, function(directive, template, outer) {
			outer.setParameter("child", directive);
		});
	});
	el.addExpression(function() {
		return template.getParameter('child').innerText;
	});
}