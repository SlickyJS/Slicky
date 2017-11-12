return function(template, el, component, directivesProvider) {
	var root = template;
	template.setDynamicParameter('greeting', function() {return 'hello world'});
	el.addText(" ");
	el.addExpression(function() {
		return template.getParameter('greeting');
	});
}