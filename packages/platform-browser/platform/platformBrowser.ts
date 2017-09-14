import {DirectiveDefinition} from '@slicky/core/metadata';
import {ClassType} from '@slicky/lang';
import {Compiler} from '@slicky/compiler';
import {Template} from '@slicky/templates/templates';
import {evalCode} from '@slicky/utils';
import {Application, PlatformInterface} from '@slicky/application';


export class PlatformBrowser implements PlatformInterface
{


	private compiler: Compiler;


	constructor()
	{
		this.compiler = new Compiler;
	}


	public compileComponentTemplate(metadata: DirectiveDefinition): ClassType<Template>
	{
		return this.createTemplateType(this.compiler.compile(metadata));
	}


	public getTemplateTypeByHash(hash: number): ClassType<Template>
	{
		return this.createTemplateType(this.compiler.getTemplateByHash(hash))
	}


	public run(application: Application, el: HTMLElement): void
	{
		application.run(this, el);
	}


	private createTemplateType(code: string): ClassType<Template>
	{
		let templateFactory = evalCode(code);
		return templateFactory(Template);
	}

}
