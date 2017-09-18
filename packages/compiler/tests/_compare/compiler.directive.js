return function(template, el, component) {
	el.addElement("directive", {}, function(el) {
		template.root.createDirective(template, el, "@directive_0", 3304418489);
	});
	el.addElement("my-child", {}, function(el) {
		template.root.createComponent(template, el, "@directive_1", 3412574437);
	});
}