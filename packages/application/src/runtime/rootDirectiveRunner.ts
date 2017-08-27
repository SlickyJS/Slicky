import {IPlatform, OnInit, DirectiveMetadataLoader, DirectiveDefinition, DirectiveDefinitionType, DirectiveDefinitionElement, DirectiveDefinitionEvent, DirectiveDefinitionInput} from '@slicky/core';
import {forEach, isFunction, exists} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {Container} from '@slicky/di';
import {ApplicationTemplate, Template} from '@slicky/templates-runtime';
import {ElementRef} from '@slicky/core';
import {DirectivesProvider} from './directivesProvider';
import {TemplatesProvider} from './templatesProvider';


export class RootDirectiveRunner
{


	private platform: IPlatform;

	private template: ApplicationTemplate;

	private container: Container;

	private metadataLoader: DirectiveMetadataLoader;

	private document: Document;

	private directivesProvider: DirectivesProvider;

	private templatesProvider: TemplatesProvider;


	constructor(platform: IPlatform, template: ApplicationTemplate, container: Container, metadataLoader: DirectiveMetadataLoader, document: Document)
	{
		this.platform = platform;
		this.template = template;
		this.container = container;
		this.metadataLoader = metadataLoader;
		this.document = document;

		this.directivesProvider = new DirectivesProvider(this.metadataLoader);
		this.templatesProvider = new TemplatesProvider(this.platform, this.template);
	}


	public run(directiveType: ClassType<any>): void
	{
		let metadata = this.metadataLoader.load(directiveType);
		let els = this.document.querySelectorAll(metadata.selector);

		forEach(els, (el: HTMLElement) => this.runDirective(directiveType, metadata, el));
	}


	private runDirective(directiveType: ClassType<any>, metadata: DirectiveDefinition, el: HTMLElement): void
	{
		let directive = this.container.create(directiveType, [
			{
				service: ElementRef,
				options: {
					useFactory: () => ElementRef.getForElement(el),
				},
			},
		]);

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
			this.runComponentTemplate(metadata, directive, el);
		}

		if (isFunction(directive['onInit'])) {
			(<OnInit>directive).onInit();
		}
	}


	private runComponentTemplate(metadata: DirectiveDefinition, component: any, el: HTMLElement): void
	{
		let templateType = this.platform.compileComponentTemplate(metadata);
		let template: Template = new templateType(this.template, this.template);

		template.addProvider('component', component);
		template.addProvider('container', this.container);
		template.addProvider('templatesProvider', this.templatesProvider);
		template.addProvider('directivesProvider', this.directivesProvider);

		template.render(el);
	}

}
