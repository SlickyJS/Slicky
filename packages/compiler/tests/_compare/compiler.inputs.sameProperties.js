return function(template, el, component) {
	el.addElement("test-directive", {}, function(el) {
		template.root.createDirectivesStorageTemplate(template, el, function(template) {
			template.addDirective("@directive_0", "2503870233", function(directive) {
				template.watch(function() {
					return component.name;
				}, function(value) {
					directive.name = value;
				});
			});
			template.addDirective("@directive_1", "586450682", function(directive) {
				template.watch(function() {
					return component.name;
				}, function(value) {
					directive.name = value;
				});
			});
		});
	});
}