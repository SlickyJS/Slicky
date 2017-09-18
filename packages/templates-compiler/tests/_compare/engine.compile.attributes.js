return function(template, el) {
	el.addElement("div", {"data-id": "5", "class": ""}, function(el) {
		el.setDynamicAttribute("class", function() {
			return (template.getParameter('divClass') + ' red') + ' highlighted';
		});
	});
}