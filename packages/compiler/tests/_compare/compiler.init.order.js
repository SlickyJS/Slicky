return function(template, el, component) {
	el.addElement("test-child-directive", {}, function(el) {
		template.root.createDirectivesStorageTemplate(template, el, function(template) {
			template.addDirective("@directive_0", "1299043621");
		});
		template.getParameter("@directive_0").onInit();
		el.addElement("div");
	});
	el.addElement("test-child-component", {}, function(el) {
		template.root.createDirectivesStorageTemplate(template, el, function(template) {
			template.addComponent("@directive_1", "172249716");
		});
	});
}