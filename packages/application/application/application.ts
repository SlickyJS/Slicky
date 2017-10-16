import {Container, ProviderOptions} from '@slicky/di';
import {exists, forEach, isString, flatten} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {AbstractExtension} from '@slicky/core';
import {DirectiveMetadataLoader} from '@slicky/core/metadata';
import {ExtensionsManager} from '@slicky/core/extensions';
import {ApplicationTemplate} from '@slicky/templates/templates';
import {Renderer} from '@slicky/templates/dom';
import {RootDirectiveRunner} from '../runtime';
import {PlatformInterface} from '../platform';


export declare interface ApplicationOptions
{
	directives?: Array<ClassType<any>>;
	document?: Document;
}


export class Application
{


	public container: Container;

	private metadataLoader: DirectiveMetadataLoader;

	private extensions: ExtensionsManager;

	private directives: Array<ClassType<any>>;

	private document: Document;


	constructor(container: Container, options: ApplicationOptions = {})
	{
		this.container = container;
		this.directives = exists(options.directives) ? flatten<ClassType<any>>(options.directives) : [];
		this.document = exists(options.document) ? options.document : document;

		this.extensions = new ExtensionsManager;
		this.metadataLoader = new DirectiveMetadataLoader(this.extensions);

		this.container.addService(DirectiveMetadataLoader, {
			useValue: this.metadataLoader,
		});
	}


	public addExtension(extension: AbstractExtension): void
	{
		this.extensions.addExtension(extension);
	}


	public run(platform: PlatformInterface, elOrSelector: Element|string): void
	{
		const el: Element = isString(elOrSelector) ? this.document.querySelector(<string>elOrSelector) : <Element>elOrSelector;

		const applicationTemplate = new ApplicationTemplate;
		const renderer = new Renderer(this.document);
		const runner = new RootDirectiveRunner(this.document, platform, applicationTemplate, this.container, this.metadataLoader, this.extensions, renderer, el);

		forEach(this.extensions.getServices(), (provider: ProviderOptions) => {
			this.container.addService(provider.service, provider.options);
		});

		this.metadataLoader.addGlobalFilters(this.extensions.getFilters());

		this.container.addService(Renderer, {
			useValue: renderer,
		});

		this.container.addService(RootDirectiveRunner, {
			useValue: runner,
		});

		forEach(this.directives, (directive: ClassType<any>) => {
			runner.run(directive);
		});
	}

}
