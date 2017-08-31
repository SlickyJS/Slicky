import {forEach, exists} from '@slicky/utils';
import {RenderableTemplate} from './renderableTemplate';
import {EmbeddedTemplate} from './embeddedTemplate';
import {ApplicationTemplate} from './applicationTemplate';
import {Template} from './template';


export type EmbeddedTemplateFactory = (template: EmbeddedTemplate, el: Node, setup: (template: EmbeddedTemplate) => void) => EmbeddedTemplate;


export class EmbeddedTemplatesContainer extends RenderableTemplate
{


	protected children: Array<EmbeddedTemplate> = [];

	private el: Node;

	private factory: EmbeddedTemplateFactory;


	constructor(application: ApplicationTemplate, el: Node, factory: EmbeddedTemplateFactory, parent: RenderableTemplate = null, root: Template = null)
	{
		super(application, parent, root);

		this.el = el;
		this.factory = factory;
	}


	public add(index: number = null, setup: (template: EmbeddedTemplate) => void = null): EmbeddedTemplate
	{
		let before = this.el;

		if (index === null) {
			index = this.children.length;
		} else if (exists(this.children[index])) {
			before = this.children[index].getFirstNode();
		}

		let template = new EmbeddedTemplate(this.application, this, this.root);

		// move template to correct index withing children
		if (index !== (this.children.length - 1)) {
			this.children.splice(index, 0, this.children.splice(this.children.length - 1, 1)[0]);
		}

		return this.factory(template, before, setup);
	}


	public remove(template: EmbeddedTemplate): void
	{
		let index = this.children.indexOf(template);
		this.children[index].destroy();
	}


	public move(template: EmbeddedTemplate, index: number): void
	{
		let previousIndex = this.children.indexOf(template);
		let sibling = this.children[index].getFirstNode();

		forEach(template.nodes, (node: Node) => {
			sibling.parentNode.insertBefore(node, sibling);
		});

		this.children.splice(index, 0, this.children.splice(previousIndex, 1)[0]);
	}

}
