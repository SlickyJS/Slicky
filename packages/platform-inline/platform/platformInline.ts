import {DirectiveDefinition} from '@slicky/core/metadata';
import {TemplateRenderFactory} from '@slicky/templates/templates';
import {Application, PlatformInterface} from '@slicky/application';


export class PlatformInline implements PlatformInterface
{


	public compileComponentTemplate(metadata: DirectiveDefinition): TemplateRenderFactory
	{
		return undefined;
	}


	public run(application: Application, elOrSelector: Element|string): void
	{
		application.run(this, elOrSelector);
	}

}
