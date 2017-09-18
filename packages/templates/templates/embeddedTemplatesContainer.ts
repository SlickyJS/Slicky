import {exists, isFunction, forEach} from '@slicky/utils';
import {RenderableTemplate, RenderableEmbeddedTemplateFactory, RenderableEmbeddedTemplateBeforeRender} from './renderableTemplate';
import {TemplateParametersList} from './baseTemplate';
import {EmbeddedTemplate} from './embeddedTemplate';
import {Template} from './template';
import {ApplicationTemplate} from './applicationTemplate';
import {Renderer} from '../dom';


export class EmbeddedTemplatesContainer extends RenderableTemplate
{


	protected children: Array<EmbeddedTemplate> = [];

	private factory: RenderableEmbeddedTemplateFactory;

	private marker: Comment;


	constructor(application: ApplicationTemplate, root: Template, parent: RenderableTemplate, document: Document, renderer: Renderer, factory: RenderableEmbeddedTemplateFactory, marker: Comment)
	{
		super(document, renderer, application, root, parent);

		this.factory = factory;
		this.marker = marker;
		this.initialized = true;
	}


	public getByIndex(index: number): EmbeddedTemplate
	{
		return this.children[index];
	}


	public add(parameters: TemplateParametersList = {}, index?: number, beforeRender?: RenderableEmbeddedTemplateBeforeRender): EmbeddedTemplate
	{
		let insertBefore: Node = this.marker;

		if (!exists(index)) {
			index = this.children.length;
		} else if (exists(this.children[index])) {
			insertBefore = this.children[index]._getFirstDOMNode();
		}

		const inner = new EmbeddedTemplate(this.document, this.renderer, this.application, this.root, this, parameters);

		// move template to correct index withing children
		if (index !== (this.children.length - 1)) {
			this.children.splice(index, 0, this.children.splice(this.children.length - 1, 1)[0]);
		}

		if (isFunction(beforeRender)) {
			beforeRender(inner, this.parent);
		}

		inner._doRenderBefore(insertBefore, this.factory);

		return inner;
	}


	public remove(template: EmbeddedTemplate): void
	{
		const index = this.children.indexOf(template);

		if (index < 0) {
			return;
		}

		this.children[index].destroy();
		this.children.splice(index, 1);
	}


	public move(template: EmbeddedTemplate, newIndex: number): void
	{
		const previousIndex = this.children.indexOf(template);

		if (previousIndex < 0) {
			return;
		}

		const sibling = this.children[newIndex]._getFirstDOMNode();

		forEach(template._getDOMNodes(), (node: Node) => {
			this.renderer.insertBefore(sibling.parentNode, node, sibling);
		});

		this.children.splice(newIndex, 0, this.children.splice(previousIndex, 1)[0]);
	}


	protected createEmbeddedTemplatesContainer(factory: RenderableEmbeddedTemplateFactory, marker: Comment): EmbeddedTemplatesContainer
	{
		return new EmbeddedTemplatesContainer(this.application, this.root, this, this.document, this.renderer, factory, marker);
	}

}
