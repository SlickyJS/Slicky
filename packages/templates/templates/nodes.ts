import {isFunction, forEach, exists} from '@slicky/utils';
import {Renderer} from '../dom';
import {RenderableTemplate} from './renderableTemplate';


export abstract class TemplateNode
{


	public _nativeNode: Node;


	public _mount(template: RenderableTemplate, renderer: Renderer): void
	{
	}

}


export class TemplateElement extends TemplateNode
{


	public _onRecursiveChildAdded: (parent: TemplateElement, child: TemplateNode) => void;

	public _nativeNode: Element;

	public _insertChildBefore: Node;

	private document: Document;

	private template: RenderableTemplate;

	private renderer: Renderer;


	constructor(document: Document, name: string, attributes: {[name: string]: string} = {}, nativeNode?: Element)
	{
		super();

		this.document = document;

		if (!exists(nativeNode)) {
			nativeNode = document.createElement(name);
		}

		this._nativeNode = nativeNode;

		forEach(attributes, (value: string, name: string) => {
			this._nativeNode.setAttribute(name, value);
		});
	}


	public _mount(template: RenderableTemplate, renderer: Renderer): void
	{
		this.template = template;
		this.renderer = renderer;
	}


	public addEvent(name: string, listener: (e: Event) => void): () => void
	{
		const refreshableListener = (e: Event) => {
			listener(e);

			if (this.template) {
				this.template.refresh();
			}
		};

		this._nativeNode.addEventListener(name, refreshableListener);

		return () => {
			this._nativeNode.removeEventListener(name, refreshableListener);
		};
	}


	public addDynamicClass(className: string, condition: () => boolean): void
	{
		if (!this.template) {
			throw new Error('TemplateElement: can not add dynamic class name, node is not yet attached to any template.');
		}

		this.template.watch(condition, (value: boolean) => {
			this.renderer.toggleClass(this._nativeNode, className, value);
		});
	}


	public setDynamicAttribute(name: string, fn: () => string): void
	{
		if (!this.template) {
			throw new Error('TemplateElement: can not add dynamic class name, node is not yet attached to any template.');
		}

		this.template.watch(fn, (value: string) => {
			this.renderer.setAttribute(this._nativeNode, name, value);
		});
	}


	public addText(text: string): TemplateText
	{
		return this.addChild(new TemplateText(this.document, text));
	}


	public addComment(comment: string): TemplateComment
	{
		return this.addChild(new TemplateComment(this.document, comment));
	}


	public addExpression(fn: () => string): TemplateExpression
	{
		return this.addChild(new TemplateExpression(this.document, fn));
	}


	public addElement(name: string, attributes: {[name: string]: string} = {}, setup?: (el: TemplateElement, nativeEl: Element) => void): TemplateElement
	{
		const el = new TemplateElement(this.document, name, attributes);

		el._onRecursiveChildAdded = this._onRecursiveChildAdded;

		this.addChild(el);

		if (isFunction(setup)) {
			setup(el, el._nativeNode);
		}

		return el;
	}


	private addChild<T extends TemplateNode>(node: T): T
	{
		if (exists(this._insertChildBefore)) {
			this._nativeNode.insertBefore(node._nativeNode, this._insertChildBefore);
		} else {
			this._nativeNode.appendChild(node._nativeNode);
		}

		if (isFunction(this._onRecursiveChildAdded)) {
			this._onRecursiveChildAdded(this, node);
		}

		return node;
	}

}


export class TemplateText extends TemplateNode
{


	public _nativeNode: Text;


	constructor(document: Document, text: string)
	{
		super();

		this._nativeNode = document.createTextNode(text);
	}


	public getText(): string
	{
		return this._nativeNode.nodeValue;
	}

}


export class TemplateComment extends TemplateNode
{


	public _nativeNode: Comment;


	constructor(document: Document, comment: string)
	{
		super();

		this._nativeNode = document.createComment(comment);
	}


	public getComment(): string
	{
		return this._nativeNode.nodeValue;
	}

}


export class TemplateExpression extends TemplateNode
{


	public _nativeNode: Text;

	private writer: () => string;


	constructor(document: Document, writer: () => string)
	{
		super();

		this._nativeNode = document.createTextNode('');
		this.writer = writer;
	}


	public _mount(template: RenderableTemplate): void
	{
		template.watch(this.writer, (value: string) => {
			this._nativeNode.nodeValue = value;
		});
	}

}
