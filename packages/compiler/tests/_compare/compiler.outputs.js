return function(template, el, component) {
	el.addElement("directive-child", {}, function(el) {
		template.root.createDirective(template, el, "@directive_0", "3055171198", function(directive) {
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
	el.addElement("component-child", {}, function(el) {
		template.root.createComponent(template, el, "@directive_1", "3561984975", function(directive, template, outer) {
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
}