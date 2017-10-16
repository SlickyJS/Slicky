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
	precompile?: Array<ClassType<any>>;
	directives?: Array<ClassType<any>>;
}


export class Application
{


	public container: Container;

	private metadataLoader: DirectiveMetadataLoader;

	private extensions: ExtensionsManager;

	private precompile: Array<ClassType<any>>;

	private directives: Array<ClassType<any>>;


	constructor(container: Container, options: ApplicationOptions = {})
	{
		this.container = container;
		this.precompile = exists(options.precompile) ? flatten<ClassType<any>>(options.precompile) : [];
		this.directives = exists(options.directives) ? flatten<ClassType<any>>(options.directives) : [];

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
		if (typeof window === 'undefined') {
			return;
		}

		const doc: Document = document;
		const el: Element = isString(elOrSelector) ? doc.querySelector(<string>elOrSelector) : <Element>elOrSelector;

		const applicationTemplate = new ApplicationTemplate;
		const renderer = new Renderer(doc);
		const runner = new RootDirectiveRunner(doc, platform, applicationTemplate, this.container, this.metadataLoader, this.extensions, renderer, el);

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
