import {ChangeDetectorRef, RealmRef} from '@slicky/core';
import {ExtensionsManager} from '@slicky/core/extensions';
import {ChangeDetector} from '@slicky/core/directives';
import {DirectiveMetadataLoader, DirectiveDefinition, DirectiveDefinitionType, DirectiveDefinitionElement, DirectiveDefinitionEvent, DirectiveDefinitionInput} from '@slicky/core/metadata';
import {forEach, exists, isFunction} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {Container, ProviderOptions} from '@slicky/di';
import {ApplicationTemplate} from '@slicky/templates/templates';
import {Renderer} from '@slicky/templates/dom';
import {PlatformInterface} from '../platform';
import {DirectiveFactory} from './directiveFactory';
import {ComponentTemplate} from './componentTemplate';
import {RootDirectiveRef} from './rootDirectiveRef';


export class RootDirectiveRunner
{


	private static ELEMENT_COMPONENT_STORAGE = '__slicky_component';


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
		const metadata = this.metadataLoader.loadDirective(directiveType);
		const els = this.el.querySelectorAll(metadata.selector);

		forEach(els, (el: Element) => this.runDirective(directiveType, metadata, el));
	}


	public runDirective<T>(directiveType: ClassType<T>, metadata: DirectiveDefinition, el: Element, providers: Array<ProviderOptions> = [], setup?: (directive: T) => void): RootDirectiveRef<T>
	{
		if (this.isElementInRootComponent(el)) {
			return;
		}

		let changeDetector: ChangeDetector;
		let realm: RealmRef;

		const container = metadata.type === DirectiveDefinitionType.Component ? this.container.fork() : this.container;

		if (metadata.type === DirectiveDefinitionType.Component) {
			changeDetector = new ChangeDetector;
			realm = new RealmRef;

			container.addService(ChangeDetectorRef, {
				useFactory: () => new ChangeDetectorRef(changeDetector),
			});

			container.addService(RealmRef, {
				useValue: realm,
			});
		}

		const directive = this.directiveFactory.createDirective(container, directiveType, metadata, el, providers);

		if (metadata.type === DirectiveDefinitionType.Component) {
			el[RootDirectiveRunner.ELEMENT_COMPONENT_STORAGE] = directive;
		}

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

		let template: ComponentTemplate = null;

		if (metadata.type === DirectiveDefinitionType.Component) {
			template = this.runComponentTemplate(container, metadata, directive, el, changeDetector, realm);
		}

		if (isFunction(setup)) {
			setup(directive);
		}

		if (metadata.onInit && !template) {
			(<any>directive).onInit();
		}

		return new RootDirectiveRef(el, directive, metadata, template === null ? undefined : template);
	}


	private runComponentTemplate<T>(container: Container, metadata: DirectiveDefinition, component: T, el: Element, changeDetector: ChangeDetector, realm: RealmRef): ComponentTemplate
	{
		this.extensions.doInitComponentContainer(container, metadata, component);

		return this.directiveFactory.runComponent(container, component, metadata, this.template, el, changeDetector, realm);
	}


	private isElementInRootComponent(el: Element): boolean
	{
		if (exists(el[RootDirectiveRunner.ELEMENT_COMPONENT_STORAGE])) {
			return true;
		}

		while (el !== this.el) {
			if (exists(el[RootDirectiveRunner.ELEMENT_COMPONENT_STORAGE])) {
				return true;
			}

			el = el.parentElement;
		}

		return false;
	}

}
