return function(template, el, component) {
	el.addElement("parent-directive", {}, function(el) {
		template.root.createDirectivesStorageTemplate(template, el, function(template) {
			template.addDirective("@directive_0", "2408510398");
		});
		el.addElement("child-component", {}, function(el) {
			template.root.createDirectivesStorageTemplate(template, el, function(template) {
				template.addComponent("@directive_1", "4115505327", function(directive, template, outer) {
					template.getParameter("@directive_0").directive = directive;
				});
			});
		});
	});
}