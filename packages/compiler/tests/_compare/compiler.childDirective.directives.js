return function(template, el, component) {
	el.addElement("parent-directive", {}, function(el) {
		template.root.createDirectivesStorageTemplate(template, el, function(template) {
			template.addDirective("@directive_0", "2408510398");
		});
		el.addElement("child-directive", {}, function(el) {
			template.root.createDirectivesStorageTemplate(template, el, function(template) {
				template.addDirective("@directive_1", "2389145182", function(directive) {
					template.getParameter("@directive_0").directive = directive;
				});
			});
		});
	});
}