import {Application, PlatformInterface} from '@slicky/core';
import {DirectiveDefinition} from '@slicky/core/metadata';
import {Compiler} from '@slicky/compiler';
import {TemplateRenderFactory} from '@slicky/templates/templates';
import {evalCode} from '@slicky/utils';


export class PlatformBrowser implements PlatformInterface
{


	private compiler: Compiler;


	constructor()
	{
		this.compiler = Compiler.createAotCompiler();
	}


	public compileComponentTemplate(metadata: DirectiveDefinition): TemplateRenderFactory
	{
		return evalCode(this.compiler.compile(metadata));
	}


	public run(application: Application, elOrSelector: Element|string): void
	{
		application.run(this, elOrSelector);
	}

}
