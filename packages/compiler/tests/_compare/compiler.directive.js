return function(template, el, component) {
	el.addElement("directive", {}, function(el) {
		template.root.createDirectivesStorageTemplate(template, el, function(template) {
			template.addDirective("@directive_0", "3304418489");
		});
	});
	el.addElement("my-child", {}, function(el) {
		template.root.createDirectivesStorageTemplate(template, el, function(template) {
			template.addComponent("@directive_1", "3343580980");
		});
	});
}