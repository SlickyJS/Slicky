return function(template, el) {
	el.addElement("div", {}, function(el) {
		el.addElement("span", {}, function(el) {
			el.addText("Hello ");
			el.addElement("i", {}, function(el) {
				el.addText("world");
			});
		});
	});
}