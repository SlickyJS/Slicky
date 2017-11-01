import {BaseTemplate, ApplicationTemplate, TemplateRenderFactory, TemplateEncapsulation} from '@slicky/templates/templates';
import {Renderer} from '@slicky/templates/dom';
import {ElementRef, FilterInterface, DirectivesStorageRef} from '@slicky/core';
import {DirectiveMetadataLoader, DirectiveDefinitionDirective, DirectiveDefinition, DirectiveDefinitionFilter} from '@slicky/core/metadata';
import {DirectivesStorage, ChangeDetector} from '@slicky/core/directives';
import {ExtensionsManager} from '@slicky/core/extensions';
import {forEach, isFunction, exists} from '@slicky/utils';
import {Container, ProviderOptions} from '@slicky/di';
import {ClassType} from '@slicky/lang';
import {PlatformInterface} from '../platform';
import {ComponentTemplate} from './componentTemplate';


export class DirectiveFactory
{


	private static ELEMENT_DIRECTIVES_STORAGE = '__slicky_directives';


	private document: Document;

	private platform: PlatformInterface;

	private extensions: ExtensionsManager;

	private application: ApplicationTemplate;

	private renderer: Renderer;

	private metadataLoader: DirectiveMetadataLoader;

	private directives: {[id: number]: DirectiveDefinitionDirective} = {};


	constructor(document: Document, platform: PlatformInterface, extensions: ExtensionsManager, metadataLoader: DirectiveMetadataLoader, application: ApplicationTemplate, renderer: Renderer)
	{
		this.document = document;
		this.platform = platform;
		this.extensions = extensions;
		this.application = application;
		this.renderer = renderer;
		this.metadataLoader = metadataLoader;

		metadataLoader.loaded.subscribe((directive: DirectiveDefinitionDirective) => {
			this.directives[directive.metadata.id] = directive;
		});
	}


	public getDirectiveTypeById<T>(id: string): ClassType<T>
	{
		return this.directives[id].directiveType;
	}


	public getMetadataById(id: string): DirectiveDefinition
	{
		return this.directives[id].metadata;
	}


	public createDirective<T>(container: Container, directiveType: ClassType<T>, metadata: DirectiveDefinition, el: Element, providers: Array<ProviderOptions> = []): T
	{
		let directives = this.getDirectivesStorage(el);

		providers.push({
			service: ElementRef,
			options: {
				useFactory: () => ElementRef.getForElement(el),
			},
		});

		providers.push({
			service: DirectivesStorageRef,
			options: {
				useFactory: () => new DirectivesStorageRef(directives),
			},
		});

		this.extensions.doUpdateDirectiveServices(directiveType, metadata, providers);

		const directive = container.create(directiveType, providers);

		directives.addDirective(directive);

		return directive;
	}


	public runComponent<T>(container: Container, component: T, metadata: DirectiveDefinition, parent: BaseTemplate, el: Element, changeDetector: ChangeDetector, setup?: (component: any, template: ComponentTemplate, outerTemplate: BaseTemplate) => void): ComponentTemplate
	{
		let templateFactory: TemplateRenderFactory;

		if (isFunction(metadata.template)) {
			templateFactory = <TemplateRenderFactory>metadata.template;
		} else {
			templateFactory = this.platform.compileComponentTemplate(metadata);
		}

		const template = new ComponentTemplate(this.document, this.renderer, container, this, this.application, parent);

		changeDetector.setTemplate(template);

		forEach(metadata.filters, (filterData: DirectiveDefinitionFilter) => {
			const filter = <FilterInterface>container.create(filterData.filterType);

			template.addFilter(filterData.metadata.name, (modify: any, ...args: Array<any>) => {
				return filter.transform(modify, ...args);
			});
		});

		if (isFunction(setup)) {
			setup(component, template, parent);
		}

		template.render(el, {
			useShadowDOM: metadata.encapsulation === TemplateEncapsulation.Native,
		}, templateFactory, component);

		return template;
	}


	private getDirectivesStorage(el: Element): DirectivesStorage
	{
		if (!exists(el[DirectiveFactory.ELEMENT_DIRECTIVES_STORAGE])) {
			el[DirectiveFactory.ELEMENT_DIRECTIVES_STORAGE] = new DirectivesStorage;
		}

		return el[DirectiveFactory.ELEMENT_DIRECTIVES_STORAGE];
	}

}
