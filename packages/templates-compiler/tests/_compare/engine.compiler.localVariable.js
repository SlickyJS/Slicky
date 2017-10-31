return function(template, el) {
	template.setDynamicParameter('greeting', function() {return 'hello world'});
	el.addText(" ");
	el.addExpression(function() {
		return template.getParameter('greeting');
	});
}