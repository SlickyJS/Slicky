return function(template, el, component) {
	el.addElement("test-directive", {"name": "David"}, function(el) {
		template.root.createDirective(template, el, "@directive_0", "2503870233", function(directive) {
			directive.name = "David";
		});
		template.root.createDirective(template, el, "@directive_1", "586450682", function(directive) {
			directive.name = "David";
		});
	});
}