return function(template, el, component) {
	el.addElement("directive", {}, function(el) {
		template.root.createDirective(template, el, "@directive_0", 1776634003, function(directive) {
			component.directive = directive;
		});
	});
}