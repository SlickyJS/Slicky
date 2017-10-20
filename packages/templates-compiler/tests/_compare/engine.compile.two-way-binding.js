return function(template, el) {
	el.addElement("photo", {}, function(el) {
		template.watch(function() {
			return template.getParameter('photoSize');
		}, function(value) {
			el._nativeNode.size = value;
		});
		el.addEvent("size-change", function($event) {
			return template.getParameter('photoSize') = $event;
		});
	});
}