return function(template, el) {
	el.addElement("button", {}, function(el) {
		el.addEvent("click", function($event) {
			return template.getParameter('onClick')($event);
		});
	});
}