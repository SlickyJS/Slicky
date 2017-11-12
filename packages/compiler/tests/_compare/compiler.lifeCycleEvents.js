return function(template, el, component, directivesProvider) {
	var root = template;
	el.addElement("directive", {}, function(el) {
		root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addDirective("@directive_0", directivesProvider.getDirectiveTypeByName("TestDirective"), function(directive) {
				template.onDestroy(function() {
					directive.onDestroy();
				});
			});
		});
		template.getParameter("@directive_0").onInit();
	});
}