import {isFunction, forEach} from '@slicky/utils';


export class ElementRef
{


	private document: Document;

	public nativeElement: HTMLElement;


	constructor(nativeElement: HTMLElement)
	{
		this.nativeElement = nativeElement;
		this.document = nativeElement.ownerDocument;
	}


	public addElement(elementName: string, attributes: {[name: string]: string} = {}, fn: (parent: ElementRef) => void = null): void
	{
		let node = this.document.createElement(elementName);

		forEach(attributes, (value: string, name: string) => {
			node.setAttribute(name, value);
		});

		this.nativeElement.appendChild(node);

		if (isFunction(fn)) {
			fn(new ElementRef(node));
		}
	}


	public addText(text: string, fn: (text: Text) => void = null): void
	{
		let node = this.document.createTextNode(text);

		this.nativeElement.appendChild(node);

		if (isFunction(fn)) {
			fn(node);
		}
	}

}
