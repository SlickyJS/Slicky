import {exists, forEach, isFunction, isString} from '@slicky/utils';
import {ListDiffer, DifferChange, DifferAction} from '@slicky/change-detection';
import {DifferTrackByFn} from '@slicky/change-detection/differs';
import {BaseTemplate, TemplateParametersList} from './baseTemplate';
import {EmbeddedTemplatesContainer} from './embeddedTemplatesContainer';
import {EmbeddedTemplate} from './embeddedTemplate';
import {Template} from './template';
import {ApplicationTemplate} from './applicationTemplate';
import {Renderer} from '../dom';
import * as nodes from './nodes';


export declare type RenderableTemplateFactory = (template: RenderableTemplate, el: nodes.TemplateElement) => void;
export declare type RenderableEmbeddedTemplateFactory = (template: EmbeddedTemplate, el: nodes.TemplateElement) => void;
export declare type RenderableEmbeddedTemplateBeforeRender = (innerTemplate: EmbeddedTemplate, outerTemplate: RenderableTemplate) => void;

declare interface ConditionStorage
{
	onTrueContainer: EmbeddedTemplatesContainer;
	onFalseContainer?: EmbeddedTemplatesContainer;
	currentTrue?: EmbeddedTemplate;
	currentFalse?: EmbeddedTemplate;
}

declare interface LoopStorage<T>
{
	container: EmbeddedTemplatesContainer;
	getter: () => Array<T>;
	options: LoopOptions;
	differ: ListDiffer<T>;
}


export declare interface LoopOptions
{
	value?: string;
	index?: string;
	iterator?: string;
}


export class LoopIterator
{


	private total: number;

	private index: number;


	constructor(total: number, index: number)
	{
		this.total = total;
		this.index = index;
	}


	public getSize(): number
	{
		return this.total;
	}


	public getCounter(): number
	{
		return this.index;
	}


	public isFirst(): boolean
	{
		return this.index === 0;
	}


	public isLast(): boolean
	{
		return this.index === (this.total - 1);
	}


	public isOdd(): boolean
	{
		return (this.index % 2) === 1;
	}


	public isEven(): boolean
	{
		return (this.index % 2) === 0;
	}

}


export abstract class RenderableTemplate extends BaseTemplate
{


	public parent: RenderableTemplate;

	protected document: Document;

	protected renderer: Renderer;

	protected useParentTemplates: boolean = true;

	protected domNodes: Array<Node> = [];

	protected lastRenderingParent: nodes.TemplateElement;

	protected lastRenderingChild: nodes.TemplateNode;

	private templates: {[name: string]: RenderableEmbeddedTemplateFactory} = {};

	private conditionsCount: number = 0;

	private loopsCount: number = 0;


	constructor(document: Document, renderer: Renderer, application: ApplicationTemplate, root?: Template, parent?: BaseTemplate, parameters: TemplateParametersList = {})
	{
		super(application, root, parent, parameters);

		this.document = document;
		this.renderer = renderer;
	}


	/**
	 * Can not be here directly because of circular imports
	 */
	protected abstract createEmbeddedTemplatesContainer(factory: RenderableEmbeddedTemplateFactory, marker: Comment): EmbeddedTemplatesContainer;


	public destroy(): void
	{
		super.destroy();

		forEach(this.domNodes, (node: Node) => {
			if (exists(node.parentNode)) {
				node.parentNode.removeChild(node);
			}
		});

		this.domNodes = [];
	}


	public declareTemplate(name: string, factory: RenderableEmbeddedTemplateFactory): void
	{
		this.templates[name] = factory;
	}


	public getTemplateFactory(name: string): RenderableEmbeddedTemplateFactory
	{
		if (exists(this.templates[name])) {
			return this.templates[name];
		}

		if (exists(this.parent) && this.useParentTemplates) {
			return this.parent.getTemplateFactory(name);
		}
	}


	public renderTemplate(name: string, parameters: TemplateParametersList = {}, beforeRender?: RenderableEmbeddedTemplateBeforeRender): EmbeddedTemplate
	{
		const container = this.renderEmbeddedTemplatesContainer(name);
		return container.add(parameters, undefined, beforeRender);
	}


	public addCondition(condition: () => boolean, onTrue: RenderableEmbeddedTemplateFactory|string, onFalse?: RenderableEmbeddedTemplateFactory|string): void
	{
		const name = `@condition_${this.conditionsCount++}`;

		let nameOnTrue: string = `${name}_onTrue`;
		let nameOnFalse: string = `${name}_onFalse`;

		if (isString(onTrue)) {
			nameOnTrue = <string>onTrue;
		} else {
			this.declareTemplate(nameOnTrue, <RenderableEmbeddedTemplateFactory>onTrue);
		}

		const storage: ConditionStorage = {
			onTrueContainer: this.renderEmbeddedTemplatesContainer(nameOnTrue),
		};

		if (exists(onFalse)) {
			if (isString(onFalse)) {
				nameOnFalse = <string>onFalse;
			} else {
				this.declareTemplate(nameOnFalse, <RenderableEmbeddedTemplateFactory>onFalse);
			}

			storage.onFalseContainer = this.renderEmbeddedTemplatesContainer(nameOnFalse);
		}

		this.watch(condition, (value) => {
			this.refreshCondition(storage, value);
		});
	}


	public addLoop<T>(options: LoopOptions, listGetter: () => Array<T>, factory: RenderableEmbeddedTemplateFactory|string, trackBy?: DifferTrackByFn<T>): void
	{
		let name = `@loop_${this.loopsCount++}`;

		if (isString(factory)) {
			name = <string>factory;
		} else {
			this.declareTemplate(name, <RenderableEmbeddedTemplateFactory>factory);
		}

		const storage: LoopStorage<T> = {
			container: this.renderEmbeddedTemplatesContainer(name),
			getter: listGetter,
			options: options,
			differ: new ListDiffer([], trackBy),
		};

		this.watch(listGetter, (items) => {
			this.refreshLoop(storage, items);
		});
	}


	public _doRender(root: nodes.TemplateElement, fn: RenderableTemplateFactory, ...args: Array<any>): void
	{
		this.lastRenderingParent = root;

		root._onRecursiveChildAdded = (parent, child) => {
			this.lastRenderingParent = parent;
			this.lastRenderingChild = child;

			child._mount(this, this.renderer);

			if (parent === root) {
				this.domNodes.push(child._nativeNode);
			}
		};

		fn(this, root, ...args);

		this.initialized = true;
	}


	public _doRenderBefore(beforeNode: Node, fn: RenderableTemplateFactory): void
	{
		const fakeRoot = new nodes.TemplateElement(this.document, '#template-inner-root', {}, <any>beforeNode.parentNode);
		fakeRoot._insertChildBefore = beforeNode;

		this._doRender(fakeRoot, fn);
	}


	public _getDOMNodes(): Array<Node>
	{
		return this.domNodes;
	}


	public _getFirstDOMNode(): Node
	{
		if (this.domNodes.length) {
			return this.domNodes[0];
		}
	}


	private renderEmbeddedTemplatesContainer(name: string): EmbeddedTemplatesContainer
	{
		const template = this.getTemplateFactory(name);

		if (!exists(template)) {
			throw new Error(`Template.renderTemplate: inner template "${name}" does not exists.`);
		}

		const marker = this.lastRenderingParent.addComment(`__tmpl_include_${name}__`);

		return this.createEmbeddedTemplatesContainer(template, marker._nativeNode);
	}


	private refreshCondition(condition: ConditionStorage, value: boolean): void
	{
		if (value) {
			if (exists(condition.currentFalse)) {
				condition.onFalseContainer.remove(condition.currentFalse);
				condition.currentFalse = undefined;
			}

			if (!exists(condition.currentTrue)) {
				condition.currentTrue = condition.onTrueContainer.add();
			}
		} else {
			if (exists(condition.currentTrue)) {
				condition.onTrueContainer.remove(condition.currentTrue);
				condition.currentTrue = undefined;
			}

			if (exists(condition.onFalseContainer)) {
				condition.currentFalse = condition.onFalseContainer.add();
			}
		}
	}


	private refreshLoop<T>(loop: LoopStorage<T>, items: Array<T>): void
	{
		// support for immutable.js
		if (isFunction(items['toJS'])) {
			items = items['toJS']();
		}

		const updateSiblings = (template: EmbeddedTemplate) => {
			if (!exists(loop.options.iterator)) {
				return;
			}

			loop.container.eachChild((sibling: EmbeddedTemplate, index: number) => {
				if (sibling === template) {
					return;
				}

				sibling.setParameters(createLoopEmbeddedTemplateParameters(loop.options, items, index));
			});
		};

		const changes = loop.differ.check(items);

		forEach(changes, (change: DifferChange<T>) => {
			let parameters: TemplateParametersList;
			let template: EmbeddedTemplate;

			switch (change.action) {
				case DifferAction.Add:
					parameters = createLoopEmbeddedTemplateParameters(loop.options, items, change.currentIndex, change.currentItem);
					template = loop.container.add(parameters, change.currentIndex);
					updateSiblings(template);
					break;
				case DifferAction.Update:
					parameters = createLoopEmbeddedTemplateParameters(loop.options, items, change.previousIndex, change.currentItem);
					template = loop.container.getByIndex(change.previousIndex);
					template.setParameters(parameters);
					break;
				case DifferAction.Remove:
					template = loop.container.getByIndex(change.previousIndex);
					loop.container.remove(template);
					updateSiblings(template);
				break;
				case DifferAction.Move:
					template = loop.container.getByIndex(change.previousIndex);
					loop.container.move(template, change.currentIndex);
					updateSiblings(template);
					break;
			}
		});
	}

}


function createLoopEmbeddedTemplateParameters<T>(options: LoopOptions, items: Array<T>, index: number, item?: T): TemplateParametersList
{
	const parameters = {};

	if (exists(options.value) && exists(item)) {
		parameters[options.value] = item;
	}

	if (exists(options.index)) {
		parameters[options.index] = index;
	}

	if (exists(options.iterator)) {
		parameters[options.iterator] = new LoopIterator(items.length, index);
	}

	return parameters;
}
