return function(template, el) {
	template.insertStyleRule("[__slicky_style__2]::before {font-weight: bold}");
	template.insertStyleRule("[__slicky_style__0]::after, [__slicky_style__0]::before {color: blue}");
	el.addElement("span", {"__slicky_style__0": ""}, function(el) {
		el.addElement("i", {"__slicky_style__2": ""});
	});
	el.addElement("div", {"__slicky_style__0": ""});
}