return function(template, el, component) {
	el.addElement("directive-child", {"attribute-input": "attr", "attribute-custom": "custom", "attribute-watch": ""}, function(el) {
		template.root.createDirective(template, el, "@directive_0", 3055171198, function(directive) {
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
		el.setDynamicAttribute("attribute-watch", function() {
			return (null);
		});
	});
	el.addElement("component-child", {"attribute-input": "attr", "attribute-custom": "custom", "attribute-watch": ""}, function(el) {
		template.root.createComponent(template, el, "@directive_1", 3561984975, function(directive, template, outer) {
			directive.attributeInput = "attr";
			directive.attributeInputCustom = "custom";
			outer.watch(function() {
				return (null);
			}, function(value) {
				directive.attributeInputWatch = value;
				template.refresh();
			});
			outer.watch(function() {
				return true;
			}, function(value) {
				directive.propertyInput = value;
				template.refresh();
			});
			outer.watch(function() {
				return false;
			}, function(value) {
				directive.propertyInputCustom = value;
				template.refresh();
			});
		});
		el.setDynamicAttribute("attribute-watch", function() {
			return (null);
		});
	});
}