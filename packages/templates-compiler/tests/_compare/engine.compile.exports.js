return function(template, el) {
	el.addElement("div", {}, function(el) {
		template.setParameter("a", el._nativeNode);
	});
	el.addExpression(function() {
		return template.getParameter('a').innerText;
	});
	el.addElement("div", {}, function(el) {
		template.setParameter("b", el._nativeNode);
	});
	el.addExpression(function() {
		return template.getParameter('b').innerText;
	});
}