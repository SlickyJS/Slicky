return function(template, el) {
	el.addExpression(function() {
		return template.getParameter('a');
	});
}