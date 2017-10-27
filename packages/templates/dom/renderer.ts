import {exists} from '@slicky/utils';


export class Renderer
{


	private document: Document;


	constructor(document: Document)
	{
		this.document = document;
	}


	public appendChild(parent: Element, node: Node): void
	{
		parent.appendChild(node);
	}


	public insertBefore(parent: Node, node: Node, before: Node): void
	{
		parent.insertBefore(node, before);
	}


	public setAttribute(el: Element, name: string, value: string): void
	{
		el.setAttribute(name, value);
	}


	public addEventListener(el: Element, name: string, fn: EventListenerOrEventListenerObject): void
	{
		el.addEventListener(name, fn);
	}


	public containsClass(el: Element, className: string): boolean
	{
		if (exists(el.classList)) {
			return el.classList.contains(className);
		}

		return el.className.split(' ').indexOf(className) >= 0;
	}


	public addClass(el: Element, className: string): void
	{
		if (!this.containsClass(el, className)) {
			if (exists(el.classList)) {
				el.classList.add(className);
			} else {
				el.className += ` ${className}`;
			}
		}
	}


	public removeClass(el: Element, className: string): void
	{
		if (this.containsClass(el, className)) {
			if (exists(el.classList)) {
				el.classList.remove(className);
			} else {
				const list = el.className.split(' ');
				const pos = list.indexOf(className);

				if (pos >= 0) {
					list.splice(pos, 1);
					el.className = list.join(' ');
				}
			}
		}
	}


	public toggleClass(el: Element, className: string, force?: boolean): boolean
	{
		if (exists(el.classList)) {
			return el.classList.toggle(className, force);
		} else {
			let list = el.className.split(' ');
			let pos = list.indexOf(className);

			if (pos >= 0) {
				if (force === true) {
					return true;
				}

				list.splice(pos, 1);

				return false;
			} else {
				if (force === false) {
					return false;
				}

				list.push(className);

				return true;
			}
		}
	}

}
