import {BaseTemplate, ApplicationTemplate, Template, RenderableTemplate, TemplateElement, TemplateParametersList} from '@slicky/templates/templates';
import {Renderer} from '@slicky/templates/dom';
import {ChangeDetector} from '@slicky/core/directives';
import {ChangeDetectorRef} from '@slicky/core';
import {DirectiveDefinition} from '@slicky/core/metadata';
import {Container, ProviderOptions} from '@slicky/di';
import {isFunction} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {DirectiveFactory} from './directiveFactory';


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


	public createDirective<T>(template: RenderableTemplate, el: TemplateElement, name: string, id: string, setup?: (directive: T) => void): void
	{
		const metadata = this.directiveFactory.getMetadataById(id);
		const directiveType = this.directiveFactory.getDirectiveTypeById(id);

		this._createDirective(template, el._nativeNode, name, this.container, directiveType, metadata, [], setup);
	}


	public createComponent(template: RenderableTemplate, el: TemplateElement, name: string, id: string, setup?: (component: any, template: ComponentTemplate, outerTemplate: BaseTemplate) => void): void
	{
		const changeDetector = new ChangeDetector;

		const metadata = this.directiveFactory.getMetadataById(id);
		const componentType = this.directiveFactory.getDirectiveTypeById(id);

		const container = this.container.fork();

		container.addService(ChangeDetectorRef, {
			useFactory: () => new ChangeDetectorRef(changeDetector),
		});

		const component = this._createDirective(template, el._nativeNode, name, container, componentType, metadata);

		this.directiveFactory.runComponent(container, component, metadata, template, el._nativeNode, changeDetector, setup);
	}


	private _createDirective<T>(template: RenderableTemplate, el: Element, name: string, container: Container, directiveType: ClassType<T>, metadata: DirectiveDefinition, providers: Array<ProviderOptions> = [], setup?: (directive: T) => void): T
	{
		const directive = <T>this.directiveFactory.createDirective(container, directiveType, metadata, el, providers);

		if (isFunction(setup)) {
			setup(directive);
		}

		template.setParameter(name, directive);

		template.onDestroy(() => {
			if (isFunction(directive['onDestroy'])) {
				template.run(() => directive['onDestroy']());
			}

			template.removeParameter(name);
		});

		return directive;
	}

}
