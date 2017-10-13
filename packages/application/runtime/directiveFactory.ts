import {BaseTemplate, ApplicationTemplate, TemplateRenderFactory, TemplateEncapsulation} from '@slicky/templates/templates';
import {Renderer} from '@slicky/templates/dom';
import {ElementRef, FilterInterface, ChangeDetectorRef} from '@slicky/core';
import {DirectiveMetadataLoader, DirectiveDefinitionDirective, DirectiveDefinition, DirectiveDefinitionFilter} from '@slicky/core/metadata';
import {ExtensionsManager} from '@slicky/core/extensions';
import {forEach, isFunction} from '@slicky/utils';
import {Container, ProviderOptions} from '@slicky/di';
import {ClassType} from '@slicky/lang';
import {PlatformInterface} from '../platform';
import {ComponentTemplate} from './componentTemplate';


export class DirectiveFactory
{


	private document: Document;

	private platform: PlatformInterface;

	private extensions: ExtensionsManager;

	private application: ApplicationTemplate;

	private renderer: Renderer;

	private directives: {[hash: number]: DirectiveDefinitionDirective} = {};


	constructor(document: Document, platform: PlatformInterface, extensions: ExtensionsManager, metadataLoader: DirectiveMetadataLoader, application: ApplicationTemplate, renderer: Renderer)
	{
		this.document = document;
		this.platform = platform;
		this.extensions = extensions;
		this.application = application;
		this.renderer = renderer;

		metadataLoader.loaded.subscribe((directive: DirectiveDefinitionDirective) => {
			this.directives[directive.metadata.hash] = directive;
		});
	}


	public getDirectiveTypeByHash<T>(hash: number): ClassType<T>
	{
		return this.directives[hash].directiveType;
	}


	public getMetadataByHash(hash: number): DirectiveDefinition
	{
		return this.directives[hash].metadata;
	}


	public createDirective<T>(container: Container, directiveType: ClassType<T>, metadata: DirectiveDefinition, el: Element, providers: Array<ProviderOptions> = []): T
	{
		providers.push({
			service: ElementRef,
			options: {
				useFactory: () => ElementRef.getForElement(el),
			},
		});

		this.extensions.doUpdateDirectiveServices(directiveType, metadata, providers);

		return container.create(directiveType, providers);
	}


	public runComponent<T>(container: Container, component: T, metadata: DirectiveDefinition, parent: BaseTemplate, el: Element, changeDetector: ChangeDetectorRef, setup?: (component: any, template: ComponentTemplate, outerTemplate: BaseTemplate) => void): ComponentTemplate
	{
		let templateFactory: TemplateRenderFactory;

		if (isFunction(metadata.render)) {
			templateFactory = metadata.render;
		} else {
			templateFactory = this.platform.compileComponentTemplate(metadata);
		}

		const template = new ComponentTemplate(this.document, this.renderer, container, this, this.application, parent);

		changeDetector._initialize(template);

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

}
