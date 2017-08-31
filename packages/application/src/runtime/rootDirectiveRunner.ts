import {IPlatform, OnInit, DirectiveMetadataLoader, DirectiveDefinition, DirectiveDefinitionType, DirectiveDefinitionElement, DirectiveDefinitionEvent, DirectiveDefinitionInput, ExtensionsManager} from '@slicky/core';
import {forEach, isFunction, exists} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {Container} from '@slicky/di';
import {ApplicationTemplate} from '@slicky/templates-runtime';
import {DirectivesProvider} from './directivesProvider';
import {TemplatesProvider} from './templatesProvider';


export class RootDirectiveRunner
{


	private platform: IPlatform;

	private template: ApplicationTemplate;

	private container: Container;

	private metadataLoader: DirectiveMetadataLoader;

	private extensions: ExtensionsManager;

	private document: Document;

	private directivesProvider: DirectivesProvider;

	private templatesProvider: TemplatesProvider;


	constructor(platform: IPlatform, template: ApplicationTemplate, container: Container, metadataLoader: DirectiveMetadataLoader, extensions: ExtensionsManager, document: Document)
	{
		this.platform = platform;
		this.template = template;
		this.container = container;
		this.metadataLoader = metadataLoader;
		this.extensions = extensions;
		this.document = document;

		this.directivesProvider = new DirectivesProvider(this.extensions, this.metadataLoader);
		this.templatesProvider = new TemplatesProvider(this.platform, this.extensions, this.template, this.directivesProvider);
	}


	public run(directiveType: ClassType<any>): void
	{
		let metadata = this.metadataLoader.load(directiveType);
		let els = this.document.querySelectorAll(metadata.selector);

		forEach(els, (el: HTMLElement) => this.runDirective(metadata, el));
	}


	private runDirective(metadata: DirectiveDefinition, el: HTMLElement): void
	{
		let container = metadata.type === DirectiveDefinitionType.Component ? this.container.fork() : this.container;
		let directive = this.directivesProvider.create(metadata.hash, el, container);

		forEach(metadata.inputs, (input: DirectiveDefinitionInput) => {
			directive[input.property] = el.getAttribute(input.name);
		});

		forEach(metadata.elements, (element: DirectiveDefinitionElement) => {
			directive[element.property] = el.querySelector(element.selector);
		});

		forEach(metadata.events, (event: DirectiveDefinitionEvent) => {
			let eventEl = exists(event.hostElement) ? directive[event.hostElement] : el.querySelector(event.selector);

			eventEl.addEventListener(event.event, (e) => directive[event.method](e, eventEl));
		});

		if (metadata.type === DirectiveDefinitionType.Component) {
			this.extensions.doInitComponentContainer(container, metadata, directive);
			this.runComponentTemplate(container, metadata, directive, el);
		}

		if (isFunction(directive['onInit'])) {
			(<OnInit>directive).onInit();
		}
	}


	private runComponentTemplate(container: Container, metadata: DirectiveDefinition, component: any, el: HTMLElement): void
	{
		let template = this.templatesProvider.createComponentTemplate(container, this.template, metadata, component);

		template.render(el);
	}

}
