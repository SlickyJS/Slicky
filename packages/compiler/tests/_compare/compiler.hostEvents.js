return function(template, el, component) {
	el.addElement("directive", {}, function(el) {
		template.root.createDirective(template, el, "@directive_0", "1776634003");
		el.addElement("button", {}, function(el) {
			el.addEvent("click", function($event) {
				template.getParameter("@directive_0").onClickButton($event);
			});
		});
	});
}