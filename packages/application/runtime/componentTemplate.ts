import {BaseTemplate, ApplicationTemplate, Template, RenderableTemplate, TemplateElement, TemplateParametersList} from '@slicky/templates/templates';
import {Renderer} from '@slicky/templates/dom';
import {Container} from '@slicky/di';
import {isFunction} from '@slicky/utils';
import {DirectiveFactory} from './directiveFactory';
import {DirectivesStorageTemplate} from './directivesStorageTemplate';


export class ComponentTemplate extends Template
{


	private container: Container;

	private directiveFactory: DirectiveFactory;


	constructor(document: Document, renderer: Renderer, container: Container, directiveFactory: DirectiveFactory, application: ApplicationTemplate, parent: BaseTemplate, parameters: TemplateParametersList = {})
	{
		super(document, renderer, application, parent, parameters);

		this.container = container;
		this.directiveFactory = directiveFactory;
	}


	public createDirectivesStorageTemplate(template: RenderableTemplate, el: TemplateElement, setup?: (template: DirectivesStorageTemplate) => void): void
	{
		const childTemplate = new DirectivesStorageTemplate(this.document, this.renderer, this.application, this, template, this.container, this.directiveFactory, el);

		if (isFunction(setup)) {
			setup(childTemplate);
		}
	}

}
