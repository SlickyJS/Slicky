import {OnInit} from '@slicky/core';
import {ExtensionsManager} from '@slicky/core/extensions';
import {DirectiveMetadataLoader, DirectiveDefinition, DirectiveDefinitionType, DirectiveDefinitionElement, DirectiveDefinitionEvent, DirectiveDefinitionInput} from '@slicky/core/metadata';
import {forEach, isFunction, exists} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {Container, ProviderOptions} from '@slicky/di';
import {ApplicationTemplate} from '@slicky/templates/templates';
import {DirectivesProvider} from './directivesProvider';
import {TemplatesProvider} from './templatesProvider';
import {PlatformInterface} from '../platform';


export class RootDirectiveRunner
{


	private platform: PlatformInterface;

	private template: ApplicationTemplate;

	private container: Container;

	private metadataLoader: DirectiveMetadataLoader;

	private extensions: ExtensionsManager;

	private el: HTMLElement;

	private directivesProvider: DirectivesProvider;

	private templatesProvider: TemplatesProvider;


	constructor(platform: PlatformInterface, template: ApplicationTemplate, container: Container, metadataLoader: DirectiveMetadataLoader, extensions: ExtensionsManager, el: HTMLElement)
	{
		this.platform = platform;
		this.template = template;
		this.container = container;
		this.metadataLoader = metadataLoader;
		this.extensions = extensions;
		this.el = el;

		this.directivesProvider = new DirectivesProvider(this.extensions, this.metadataLoader);
		this.templatesProvider = new TemplatesProvider(this.platform, this.extensions, this.template, this.directivesProvider);
	}


	public run(directiveType: ClassType<any>): void
	{
		let metadata = this.metadataLoader.load(directiveType);
		let els = this.el.querySelectorAll(metadata.selector);

		forEach(els, (el: HTMLElement) => this.runDirective(metadata, el));
	}


	public runDirective(metadata: DirectiveDefinition, el: HTMLElement, providers: Array<ProviderOptions> = []): any
	{
		let container = metadata.type === DirectiveDefinitionType.Component ? this.container.fork() : this.container;
		let directive = this.directivesProvider.create(metadata.hash, el, container, providers);

		forEach(metadata.inputs, (input: DirectiveDefinitionInput) => {
			directive[input.property] = el.getAttribute(input.name);
		});

		forEach(metadata.elements, (element: DirectiveDefinitionElement) => {
			directive[element.property] = el.querySelector(element.selector);
		});

		forEach(metadata.events, (event: DirectiveDefinitionEvent) => {
			let eventEl = exists(event.hostElement) ?
				directive[event.hostElement] :
				(
					exists(event.selector) ?
						el.querySelector(event.selector) :
						el
				)
			;

			if (!eventEl) {
				throw new Error(`${metadata.name}.${event.method}: @HostEvent for "${event.selector}" was not found.`);
			}

			eventEl.addEventListener(event.event, (e) => directive[event.method](e, eventEl));
		});

		if (metadata.type === DirectiveDefinitionType.Component) {
			this.extensions.doInitComponentContainer(container, metadata, directive);
			this.runComponentTemplate(container, metadata, directive, el);
		}

		if (isFunction(directive['onInit'])) {
			(<OnInit>directive).onInit();
		}

		return directive;
	}


	private runComponentTemplate(container: Container, metadata: DirectiveDefinition, component: any, el: HTMLElement): void
	{
		let template = this.templatesProvider.createComponentTemplate(container, this.template, metadata, component);

		template.render(el);
	}

}
