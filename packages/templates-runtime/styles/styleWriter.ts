export class StyleWriter
{


	private style: HTMLStyleElement;

	private sheet: CSSStyleSheet;

	private initialized: boolean = false;


	public insertRule(selector: string, rules: Array<string>): void
	{
		this.initialize();
		this.sheet.insertRule(`${selector} {${rules.join(', ')}}`);
	}


	public destroy(): void
	{
		if (!this.initialized) {
			return;
		}

		for (let i = 0; i < this.sheet.rules.length; i++) {
			this.sheet.deleteRule(i);
		}

		this.style.parentElement.removeChild(this.style);

		delete this.style;
		delete this.sheet;

		this.initialized = false;
	}


	private initialize(): void
	{
		if (this.initialized) {
			return;
		}

		this.style = document.createElement('style');
		this.style.appendChild(document.createTextNode(''));

		document.head.appendChild(this.style);

		this.sheet = <CSSStyleSheet>this.style.sheet;

		this.initialized = true;
	}

}
