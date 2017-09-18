return function(template, el) {
	template.declareTemplate("@template_0", function(template, el) {
		el.addExpression(function() {
			return template.getParameter('firstName');
		});
		el.addText(" ");
		el.addExpression(function() {
			return template.getParameter('lastName');
		});
	});
	template.renderTemplate("@template_0", {"lastName": "K."}, function(template, outer) {
		outer.watch(function() {
			return outer.getParameter('user').david;
		}, function(value) {
			template.setParameter("firstName", value);
		});
	});
	template.renderTemplate("@template_0", {"lastName": "F."}, function(template, outer) {
		outer.watch(function() {
			return outer.getParameter('user').clare;
		}, function(value) {
			template.setParameter("firstName", value);
		});
	});
}