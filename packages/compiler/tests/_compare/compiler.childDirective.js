return function(template, el, component) {
	el.addElement("directive", {}, function(el) {
		template.root.createDirectivesStorageTemplate(template, el, function(template) {
			template.addDirective("@directive_0", "1776634003", function(directive) {
				component.directive = directive;
			});
		});
	});
}