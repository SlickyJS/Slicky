return function(template, el, component, directivesProvider) {
	template.insertStyleRule("[__slicky_style_TestComponent_0] {color: red}");
	template.insertStyleRule("[__slicky_style_TestComponent_1] {color: green}");
	template.insertStyleRule("@media print {[__slicky_style_TestComponent_1] {display: none}}");
	var root = template;
	el.addElement("div", {"class": "parent-template parent-override", "__slicky_style_TestComponent_0": "", "__slicky_style_TestComponent_1": "", "__slicky_style_TestComponent_1": ""});
}