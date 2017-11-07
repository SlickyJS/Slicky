return function(template, el, component) {
	el.addElement("test-directive", {}, function(el) {
		template.root.createDirectivesStorageTemplate(template, el, function(template) {
			template.addDirective("@directive_0", "2518409384");
		});
	});
}