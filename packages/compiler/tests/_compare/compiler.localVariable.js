return function(template, el, component) {
	template.setParameter('greeting', 'hello world');
	el.addText(" ");
	el.addExpression(function() {
		return template.getParameter('greeting');
	});
}