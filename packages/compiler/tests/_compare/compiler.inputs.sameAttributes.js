return function(template, el, component) {
	el.addElement("test-directive", {"name": "David"}, function(el) {
		template.root.createDirectivesStorageTemplate(template, el, function(template) {
			template.addDirective("@directive_0", "2503870233", function(directive) {
				directive.name = "David";
			});
			template.addDirective("@directive_1", "586450682", function(directive) {
				directive.name = "David";
			});
		});
	});
}