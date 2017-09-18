return function(template, el) {
	template.insertStyleRule("@media screen {[__slicky_style__0] {color: red}}");
	el.addElement("span", {"__slicky_style__0": ""});
}