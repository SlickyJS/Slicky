return function(template, el) {
	el.addElement("div", {}, function(el) {
		template.watch(function() {
			return template.getParameter('getStyles')();
		}, function(value) {
			el._nativeNode.style = value;
		});
		el.addDynamicClass("alert", function() {
			return template.getParameter('isAlert')();
		});
	});
}