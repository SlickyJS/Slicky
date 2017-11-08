return function(template, el, component, directivesProvider) {
	template.setDynamicParameter('greeting', function() {return 'hello world'});
	el.addText(" ");
	el.addExpression(function() {
		return template.getParameter('greeting');
	});
}