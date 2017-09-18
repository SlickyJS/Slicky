return function(template, el) {
	el.addExpression(function() {
		return template.filter('plus', 5, 4);
	});
}