return function(template, el, component, directivesProvider) {
	el.addElement("directive", {}, function(el) {
		template.root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addDirective("@directive_0", directivesProvider.getDirectiveTypeByName("TestDirective"));
		});
		el.addElement("button", {}, function(el) {
			el.addEvent("click", function($event) {
				template.getParameter("@directive_0").onClickButton($event);
			});
		});
	});
}