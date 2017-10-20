export function callDomEvent(document: Document, element: Element, type: string, name: string): void
{
	let event = document.createEvent(type);
	event.initEvent(name, false, true);

	element.dispatchEvent(event);
}


export function createElement<T extends HTMLElement>(document: Document, innerHTML: string): T
{
	let parent = document.createElement('div');
	parent.innerHTML = innerHTML;

	let child = parent.children[0];

	parent.removeChild(child);

	return <T>child;
}


export function callMouseEvent(document: Document, element: Element, name: string): void
{
	callDomEvent(document, element, 'MouseEvent', name);
}
