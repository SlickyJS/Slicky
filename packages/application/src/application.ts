import {Container, ProviderOptions} from '@slicky/di';
import {exists, forEach} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {DirectiveMetadataLoader, ExtensionsManager, AbstractExtension} from '@slicky/core';
import {ApplicationTemplate, CommonTemplateHelpers} from '@slicky/templates-runtime';
import {RootDirectiveRunner} from './runtime';
import {PlatformInterface} from './platform';


export declare interface ApplicationOptions
{
	directives?: Array<ClassType<any>>;
}


export class Application
{


	private container: Container;

	private metadataLoader: DirectiveMetadataLoader;

	private extensions: ExtensionsManager;

	private directives: Array<ClassType<any>>;


	constructor(container: Container, options: ApplicationOptions = {})
	{
		this.container = container;
		this.directives = exists(options.directives) ? options.directives : [];

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


	public getDirectives(): Array<ClassType<any>>
	{
		return this.directives;
	}


	public run(platform: PlatformInterface, el: HTMLElement): void
	{
		let applicationTemplate = new ApplicationTemplate;

		forEach(this.extensions.getServices(), (provider: ProviderOptions) => {
			this.container.addService(provider.service, provider.options);
		});

		this.metadataLoader.addGlobalFilters(this.extensions.getFilters());

		CommonTemplateHelpers.install(applicationTemplate);

		let runner = new RootDirectiveRunner(platform, applicationTemplate, this.container, this.metadataLoader, this.extensions, el);

		forEach(this.directives, (directive: ClassType<any>) => {
			runner.run(directive);
		});
	}

}
