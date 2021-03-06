import {Application, PlatformInterface} from '@slicky/core';
import {DirectiveDefinition} from '@slicky/core/metadata';
import {TemplateRenderFactory} from '@slicky/templates/templates';


export class PlatformInline implements PlatformInterface
{


	public compileComponentTemplate(metadata: DirectiveDefinition): TemplateRenderFactory
	{
		throw new Error(`@slicky/platform-inline can not compile component ${metadata.className}. Precompile your templates with @slicky/compiler-cli or @slicky/webpack-loader. Or you can use @slicky/platform-browser instead.`);
	}


	public run(application: Application, elOrSelector: Element|string): void
	{
		application.run(this, elOrSelector);
	}

}
