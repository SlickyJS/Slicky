return function(template, el) {
	el.addElement("div", {}, function(el) {
		template.setParameter("a", el._nativeNode);
	});
	el.addElement("div", {}, function(el) {
		template.setParameter("b", el._nativeNode);
	});
}