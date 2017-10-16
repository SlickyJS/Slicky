return function(template, el, component) {
	el.addElement("parent-directive", {}, function(el) {
		template.root.createDirective(template, el, "@directive_0", 2408510398);
		el.addElement("child-component", {}, function(el) {
			template.root.createComponent(template, el, "@directive_1", 2690946270, function(directive, template, outer) {
				template.getParameter("@directive_0").directive = directive;
			});
		});
	});
}