import {isFunction, forEach, exists} from '@slicky/utils';
import {DefaultWatcherProvider} from '../providers';
import {BaseTemplate} from './baseTemplate';
import {ApplicationTemplate} from './applicationTemplate';
import {Template} from './template';


declare interface TemplateListener
{
	element: HTMLElement;
	name: string;
	callback: EventListenerOrEventListenerObject;
}


export abstract class RenderableTemplate extends BaseTemplate
{


	public _refreshing: number = 0;

	public nodes: Array<Node> = [];

	protected children: Array<RenderableTemplate> = [];

	protected root: Template;

	protected initialized: boolean = false;

	protected allowRefreshFromParent: boolean = true;

	private listeners: Array<TemplateListener> = [];


	constructor(application: ApplicationTemplate, parent: BaseTemplate = null, root: Template = null)
	{
		super(application, parent);

		this.root = root;
		this.addProvider('watcher', new DefaultWatcherProvider);
	}


	public refresh(): void
	{
		if (!this.initialized) {
			return;
		}

		this._refreshing++;

		this.getProvider('watcher').check();

		forEach(this.children, (child: RenderableTemplate) => {
			if (child.allowRefreshFromParent) {
				child.refresh();
			}
		});

		this._refreshing--;
	}


	public init(): void
	{
		super.init();

		this.initialized = true;
	}


	public destroy(): void
	{
		super.destroy();

		forEach(this.listeners, (listener: TemplateListener) => {
			listener.element.removeEventListener(listener.name, listener.callback);
		});

		forEach(this.nodes, (node: Node) => {
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		});

		this.listeners = [];
		this.nodes = [];

		this.getProvider('watcher').disable();
	}


	public getFirstNode(): Node
	{
		return exists(this.nodes[0]) ? this.nodes[0] : null;
	}


	protected _appendComment(parent: HTMLElement, comment: string, fn: (comment: Comment) => void = null): void
	{
		this.appendChild(parent, parent.ownerDocument.createComment(comment), fn);
	}


	protected _insertCommentBefore(before: Node, comment: string, fn: (comment: Comment) => void = null): void
	{
		this.insertChildBefore(before, before.ownerDocument.createComment(comment), fn);
	}


	protected _appendText(parent: HTMLElement, text: string, fn: (text: Text) => void = null): void
	{
		this.appendChild(parent, parent.ownerDocument.createTextNode(text), fn);
	}


	protected _insertTextBefore(before: Node, text: string, fn: (text: Text) => void = null): void
	{
		this.insertChildBefore(before, before.ownerDocument.createTextNode(text), fn);
	}


	protected _appendElement(parent: HTMLElement, elementName: string, attributes: {[name: string]: string} = {}, fn: (parent: HTMLElement) => void = null): void
	{
		let node = parent.ownerDocument.createElement(elementName);

		forEach(attributes, (value: string, name: string) => {
			node.setAttribute(name, value);
		});

		this.appendChild(parent, node, fn);
	}


	protected _insertElementBefore(before: Node, elementName: string, attributes: {[name: string]: string} = {}, fn: (parent: HTMLElement) => void = null): void
	{
		let node = before.ownerDocument.createElement(elementName);

		forEach(attributes, (value: string, name: string) => {
			node.setAttribute(name, value);
		});

		this.insertChildBefore(before, node, fn);
	}


	protected _addElementEventListener(element: HTMLElement, eventName: string, callback: EventListenerOrEventListenerObject): void
	{
		this.listeners.push({
			element: element,
			name: eventName,
			callback: callback,
		});

		this.run(() => {
			element.addEventListener(eventName, callback, false);
		});
	}


	private appendChild(parent: HTMLElement, child: Node, fn: (node: Node) => void = null): void
	{
		parent.appendChild(child);
		this.nodes.push(child);

		if (isFunction(fn)) {
			fn(child);
		}
	}


	private insertChildBefore(before: Node, sibling: Node, fn: (node: Node) => void = null): void
	{
		before.parentNode.insertBefore(sibling, before);
		this.nodes.push(sibling);

		if (isFunction(fn)) {
			fn(sibling);
		}
	}

}
