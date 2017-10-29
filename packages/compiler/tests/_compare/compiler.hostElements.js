return function(template, el, component) {
	el.addElement("test-directive", {}, function(el) {
		template.root.createDirective(template, el, "@directive_0", "2518409384");
		el.addElement("span", {}, function(el) {
			template.getParameter("@directive_0").el = el._nativeNode;
		});
	});
	el.addElement("i", {}, function(el) {
		component.el = el._nativeNode;
	});
}