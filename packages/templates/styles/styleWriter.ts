export class StyleWriter
{


	private document: Document;

	private parent: HTMLElement|ShadowRoot;

	private style: HTMLStyleElement;

	private sheet: CSSStyleSheet;

	private initialized: boolean = false;


	constructor(document: Document, parent: HTMLElement|ShadowRoot)
	{
		this.document = document;
		this.parent = parent;
	}


	public changeParent(parent: HTMLElement|ShadowRoot): void
	{
		if (this.initialized) {
			throw new Error('StyleWriter: can not change parent when styleWriter is already initialized.');
		}

		this.parent = parent;
	}


	public insertRule(rule: string): void
	{
		this.initialize();
		this.sheet.insertRule(rule);
	}


	public destroy(): void
	{
		if (!this.initialized) {
			return;
		}

		for (let i = 0; i < this.sheet.rules.length; i++) {
			this.sheet.deleteRule(i);
		}

		this.style.parentNode.removeChild(this.style);

		delete this.style;
		delete this.sheet;

		this.initialized = false;
	}


	private initialize(): void
	{
		if (this.initialized) {
			return;
		}

		this.style = this.document.createElement('style');
		this.style.appendChild(this.document.createTextNode(''));

		this.parent.appendChild(this.style);

		this.sheet = <CSSStyleSheet>this.style.sheet;
		this.initialized = true;
	}

}
