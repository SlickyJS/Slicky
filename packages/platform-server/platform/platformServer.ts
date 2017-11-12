import {Application, PlatformInterface} from '@slicky/core';
import {DirectiveDefinition} from '@slicky/core/metadata';
import {TemplateRenderFactory} from '@slicky/templates/templates';


export class PlatformServer implements PlatformInterface
{


	private templatesFactory: (name: string) => TemplateRenderFactory;


	constructor(templatesFactory: (name: string) => TemplateRenderFactory)
	{
		this.templatesFactory = templatesFactory;
	}


	public compileComponentTemplate(metadata: DirectiveDefinition): TemplateRenderFactory
	{
		return this.templatesFactory(metadata.name);
	}


	public run(application: Application, elOrSelector: Element|string): void
	{
		application.run(this, elOrSelector);
	}

}
