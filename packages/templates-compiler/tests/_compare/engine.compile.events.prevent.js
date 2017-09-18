return function(template, el) {
	el.addElement("button", {}, function(el) {
		el.addEvent("click", function($event) {
			$event.preventDefault();
			return template.getParameter('onClick')($event);
		});
	});
}