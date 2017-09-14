import {DirectiveDefinition} from '@slicky/core/metadata';
import {ClassType} from '@slicky/lang';
import {Template} from '@slicky/templates/templates';
import {Application, PlatformInterface} from '@slicky/application';


export class PlatformServer implements PlatformInterface
{


	private templatesFactory: (hash: number) => ClassType<Template>;


	constructor(templatesFactory: (hash: number) => ClassType<Template>)
	{
		this.templatesFactory = templatesFactory;
	}


	public compileComponentTemplate(metadata: DirectiveDefinition): ClassType<Template>
	{
		return this.getTemplateTypeByHash(metadata.hash);
	}


	public getTemplateTypeByHash(hash: number): ClassType<Template>
	{
		return this.templatesFactory(hash);
	}


	public run(application: Application, el: HTMLElement): void
	{
		application.run(this, el);
	}

}
