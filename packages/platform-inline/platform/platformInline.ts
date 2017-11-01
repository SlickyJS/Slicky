import {DirectiveDefinition} from '@slicky/core/metadata';
import {TemplateRenderFactory} from '@slicky/templates/templates';
import {Application, PlatformInterface} from '@slicky/application';


export class PlatformInline implements PlatformInterface
{


	public compileComponentTemplate(metadata: DirectiveDefinition): TemplateRenderFactory
	{
		throw new Error(`@slicky/platform-inline can not compile component ${metadata.name}. Precompile your templates with @slicky/compiler-cli or @slicky/webpack-loader. Or you can use @slicky/platform-browser instead.`);
	}


	public run(application: Application, elOrSelector: Element|string): void
	{
		application.run(this, elOrSelector);
	}

}
