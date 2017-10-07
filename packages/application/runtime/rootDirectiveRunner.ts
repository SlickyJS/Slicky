import {ExtensionsManager} from '@slicky/core/extensions';
import {DirectiveMetadataLoader, DirectiveDefinition, DirectiveDefinitionType, DirectiveDefinitionElement, DirectiveDefinitionEvent, DirectiveDefinitionInput} from '@slicky/core/metadata';
import {forEach, isFunction, exists} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {Container, ProviderOptions} from '@slicky/di';
import {ApplicationTemplate} from '@slicky/templates/templates';
import {Renderer} from '@slicky/templates/dom';
import {PlatformInterface} from '../platform';
import {DirectiveFactory} from './directiveFactory';


export class RootDirectiveRunner
{


	private platform: PlatformInterface;

	private template: ApplicationTemplate;

	private container: Container;

	private metadataLoader: DirectiveMetadataLoader;

	private extensions: ExtensionsManager;

	private el: Element;

	private directiveFactory: DirectiveFactory;


	constructor(document: Document, platform: PlatformInterface, template: ApplicationTemplate, container: Container, metadataLoader: DirectiveMetadataLoader, extensions: ExtensionsManager, renderer: Renderer, el: Element)
	{
		this.platform = platform;
		this.template = template;
		this.container = container;
		this.metadataLoader = metadataLoader;
		this.extensions = extensions;
		this.el = el;

		this.directiveFactory = new DirectiveFactory(document, this.platform, this.extensions, this.metadataLoader, this.template, renderer);
	}


	public run<T>(directiveType: ClassType<T>): void
	{
		const metadata = this.metadataLoader.load(directiveType);
		const els = this.el.querySelectorAll(metadata.selector);

		forEach(els, (el: Element) => this.runDirective(directiveType, metadata, el));
	}


	public runDirective<T>(directiveType: ClassType<T>, metadata: DirectiveDefinition, el: Element, providers: Array<ProviderOptions> = []): any
	{
		const container = metadata.type === DirectiveDefinitionType.Component ? this.container.fork() : this.container;
		const directive = this.directiveFactory.createDirective(container, directiveType, metadata, el, providers);

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
			this.runComponentTemplate(container, metadata, directive, el);
		}

		if (isFunction(directive['onInit'])) {
			(<any>directive).onInit();
		}

		return directive;
	}


	private runComponentTemplate<T>(container: Container, metadata: DirectiveDefinition, component: T, el: Element): void
	{
		this.extensions.doInitComponentContainer(container, metadata, component);
		this.directiveFactory.runComponent(container, component, metadata, this.template, el);
	}

}
