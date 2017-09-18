import {DirectiveDefinition} from '@slicky/core/metadata';
import {TemplateRenderFactory} from '@slicky/templates/templates';
import {Application, PlatformInterface} from '@slicky/application';


export class PlatformServer implements PlatformInterface
{


	private templatesFactory: (hash: number) => TemplateRenderFactory;


	constructor(templatesFactory: (hash: number) => TemplateRenderFactory)
	{
		this.templatesFactory = templatesFactory;
	}


	public compileComponentTemplate(metadata: DirectiveDefinition): TemplateRenderFactory
	{
		return this.templatesFactory(metadata.hash);
	}


	public run(application: Application, elOrSelector: Element|string): void
	{
		application.run(this, elOrSelector);
	}

}
