import {Container, ProviderOptions} from '@slicky/di';
import {exists, forEach} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {IPlatform, DirectiveMetadataLoader, ExtensionsManager, AbstractExtension, FilterInterface} from '@slicky/core';
import {ApplicationTemplate, CommonTemplateHelpers} from '@slicky/templates-runtime';
import {RootDirectiveRunner} from './runtime';


export declare interface ApplicationOptions
{
	document?: Document;
	appElement?: HTMLElement|Document;
	directives?: Array<ClassType<any>>;
}


export class Application
{


	private platform: IPlatform;

	private template: ApplicationTemplate;

	private container: Container;

	private document: Document;

	private appElement: HTMLElement|Document;

	private metadataLoader: DirectiveMetadataLoader;

	private extensions: ExtensionsManager;

	private directives: Array<ClassType<any>>;


	constructor(platform: IPlatform, template: ApplicationTemplate, container: Container, options: ApplicationOptions = {})
	{
		this.platform = platform;
		this.template = template;
		this.container = container;
		this.document = exists(options.document) ? options.document : document;
		this.appElement = exists(options.appElement) ? options.appElement : this.document;
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


	public run(): void
	{
		forEach(this.extensions.getServices(), (provider: ProviderOptions) => {
			this.container.addService(provider.service, provider.options);
		});

		this.metadataLoader.addGlobalFilters(this.extensions.getFilters());

		CommonTemplateHelpers.install(this.template);

		let runner = new RootDirectiveRunner(this.platform, this.template, this.container, this.metadataLoader, this.extensions, this.document);

		forEach(this.directives, (directive: ClassType<any>) => {
			runner.run(directive);
		});
	}

}
