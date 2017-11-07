return function(template, el, component) {
	el.addElement("child-component", {}, function(el) {
		template.root.createDirectivesStorageTemplate(template, el, function(template) {
			template.addComponent("@directive_0", "1054190473", function(directive, template, outer) {
				outer.setParameter("child", directive);
			});
		});
	});
	el.addExpression(function() {
		return template.getParameter('child').innerText;
	});
}