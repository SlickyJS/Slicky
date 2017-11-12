return function(template, el, component, directivesProvider) {
	var root = template;
	el.addElement("directive-child", {}, function(el) {
		root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addDirective("@directive_0", directivesProvider.getDirectiveTypeByName("TestDirectiveChild"), function(directive) {
				directive.output.subscribe(function($event) {
					template.run(function() {
						component.do();
					});
				});
				directive.outputCustom.subscribe(function($event) {
					template.run(function() {
						component.doOther();
					});
				});
			});
		});
	});
	el.addElement("component-child", {}, function(el) {
		root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addComponent("@directive_1", directivesProvider.getDirectiveTypeByName("TestComponentChild"), function(directive, template, outer) {
				directive.output.subscribe(function($event) {
					outer.run(function() {
						component.do();
					});
				});
				directive.outputCustomName.subscribe(function($event) {
					outer.run(function() {
						component.doOther();
					});
				});
			});
		});
	});
}