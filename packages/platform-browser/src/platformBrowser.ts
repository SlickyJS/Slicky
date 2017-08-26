import {IPlatform, DirectiveDefinition} from '@slicky/core';
import {ClassType} from '@slicky/lang';
import {Compiler} from '@slicky/compiler';
import {Template} from '@slicky/templates-runtime';
import {evalCode} from '@slicky/utils';


export class PlatformBrowser implements IPlatform
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


	private createTemplateType(code: string): ClassType<Template>
	{
		let templateFactory = evalCode(code);
		return templateFactory(Template);
	}

}
