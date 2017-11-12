return function(template, el, component, directivesProvider) {
	var root = template;
	el.addElement("directive-child", {"attribute-input": "attr", "attribute-custom": "custom", "attribute-watch": ""}, function(el) {
		root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addDirective("@directive_0", directivesProvider.getDirectiveTypeByName("TestDirectiveChild"), function(directive) {
				directive.attributeInput = "attr";
				directive.attributeInputCustom = "custom";
				template.watch(function() {
					return (null);
				}, function(value) {
					directive.attributeInputWatch = value;
				});
				template.watch(function() {
					return true;
				}, function(value) {
					directive.propertyInput = value;
				});
				template.watch(function() {
					return false;
				}, function(value) {
					directive.propertyInputCustom = value;
				});
			});
		});
		el.setDynamicAttribute("attribute-watch", function() {
			return (null);
		});
	});
	el.addElement("component-child", {"attribute-input": "attr", "attribute-custom": "custom", "attribute-watch": ""}, function(el) {
		root.createDirectivesStorageTemplate(template, directivesProvider, el, function(template, directivesProvider) {
			template.addComponent("@directive_1", directivesProvider.getDirectiveTypeByName("TestComponentChild"), function(directive, template, outer) {
				directive.attributeInput = "attr";
				directive.attributeInputCustom = "custom";
				outer.watch(function() {
					return (null);
				}, function(value) {
					directive.attributeInputWatch = value;
					template.markForRefresh();
				});
				outer.watch(function() {
					return true;
				}, function(value) {
					directive.propertyInput = value;
					template.markForRefresh();
				});
				outer.watch(function() {
					return false;
				}, function(value) {
					directive.propertyInputCustom = value;
					template.markForRefresh();
				});
			});
		});
		el.setDynamicAttribute("attribute-watch", function() {
			return (null);
		});
	});
}