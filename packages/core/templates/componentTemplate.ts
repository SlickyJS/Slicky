import {BaseTemplate, ApplicationTemplate, Template, RenderableTemplate, TemplateElement, TemplateParametersList} from '@slicky/templates/templates';
import {Renderer} from '@slicky/templates/dom';
import {Container} from '@slicky/di';
import {isFunction} from '@slicky/utils';
import {DirectiveMetadataLoader} from '@slicky/core/metadata';
import {DirectiveFactory, DirectiveTypesProvider} from '../runtime';
import {DirectivesStorageTemplate} from './directivesStorageTemplate';


export declare type ComponentTemplateRenderFactory = (template: ComponentTemplate, el: TemplateElement, component: any, directivesProvider: DirectiveTypesProvider) => void;


export class ComponentTemplate extends Template
{


	private container: Container;

	private directiveFactory: DirectiveFactory;

	private metadataLoader: DirectiveMetadataLoader;


	constructor(document: Document, renderer: Renderer, container: Container, directiveFactory: DirectiveFactory, metadataLoader: DirectiveMetadataLoader, application: ApplicationTemplate, parent: BaseTemplate, parameters: TemplateParametersList = {})
	{
		super(document, renderer, application, parent, parameters);

		this.container = container;
		this.directiveFactory = directiveFactory;
		this.metadataLoader = metadataLoader;

		this.useRefreshFromParent = true;
	}


	public createDirectivesStorageTemplate(template: RenderableTemplate, directivesProvider: DirectiveTypesProvider, el: TemplateElement, setup?: (template: DirectivesStorageTemplate, directivesProvider: DirectiveTypesProvider) => void): void
	{
		const childTemplate = new DirectivesStorageTemplate(this.document, this.renderer, this.application, this, template, this.container, this.directiveFactory, this.metadataLoader, directivesProvider, el);

		if (isFunction(setup)) {
			setup(childTemplate, directivesProvider.fork());
		}
	}

}
