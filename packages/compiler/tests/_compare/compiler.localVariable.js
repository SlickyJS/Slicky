return function(template, el, component) {
	template.setDynamicParameter('greeting', function() {return 'hello world'});
	el.addText(" ");
	el.addExpression(function() {
		return template.getParameter('greeting');
	});
}