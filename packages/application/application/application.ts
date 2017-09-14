import {Container, ProviderOptions} from '@slicky/di';
import {exists, forEach} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {AbstractExtension} from '@slicky/core';
import {DirectiveMetadataLoader} from '@slicky/core/metadata';
import {ExtensionsManager} from '@slicky/core/extensions';
import {CommonTemplateHelpers} from '@slicky/templates';
import {ApplicationTemplate} from '@slicky/templates/templates';
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
		this.precompile = exists(options.precompile) ? options.precompile : [];
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


	public getPrecompileDirectives(): Array<ClassType<any>>
	{
		return [].concat(this.precompile, this.extensions.getPrecompileDirectives(), this.directives);
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

		this.container.addService(RootDirectiveRunner, {
			useValue: runner,
		});

		forEach(this.directives, (directive: ClassType<any>) => {
			runner.run(directive);
		});
	}

}
