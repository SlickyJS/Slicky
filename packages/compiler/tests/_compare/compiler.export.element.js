return function(template, el, component) {
	el.addElement("div", {}, function(el) {
		template.root.createDirective(template, el, "@directive_0", "2439931071");
		template.setParameter("el", el._nativeNode);
	});
	el.addExpression(function() {
		return template.getParameter('el').innerText;
	});
}