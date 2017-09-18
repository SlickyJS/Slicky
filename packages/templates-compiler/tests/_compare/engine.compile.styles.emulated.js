return function(template, el) {
	template.insertStyleRule("[__slicky_style__0] {color: red; border: none}");
	el.addElement("button", {"__slicky_style__0": ""});
	el.addElement("a", {"__slicky_style__0": ""});
}