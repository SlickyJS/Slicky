import {Container} from '@slicky/di';
import {exists, forEach} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {IPlatform, DirectiveMetadataLoader} from '@slicky/core';
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

	private directives: Array<ClassType<any>>;


	constructor(platform: IPlatform, template: ApplicationTemplate, container: Container, options: ApplicationOptions = {})
	{
		this.platform = platform;
		this.template = template;
		this.container = container;
		this.document = exists(options.document) ? options.document : document;
		this.appElement = exists(options.appElement) ? options.appElement : this.document;
		this.directives = exists(options.directives) ? options.directives : [];
	}


	public run(): void
	{
		CommonTemplateHelpers.install(this.template);

		let runner = new RootDirectiveRunner(this.platform, this.template, this.container, new DirectiveMetadataLoader, this.document);

		forEach(this.directives, (directive: ClassType<any>) => {
			runner.run(directive);
		});
	}

}
