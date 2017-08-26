import {IPlatform, DirectiveDefinition} from '@slicky/core';
import {ClassType} from '@slicky/lang';
import {Template} from '@slicky/templates-runtime';


export class PlatformServer implements IPlatform
{


	private templatesFactory: (hash: number) => ClassType<Template>;


	constructor(templatesFactory: (hash: number) => ClassType<Template>)
	{
		this.templatesFactory = templatesFactory;
	}


	compileComponentTemplate(metadata: DirectiveDefinition): ClassType<Template>
	{
		return this.getTemplateTypeByHash(metadata.hash);
	}


	getTemplateTypeByHash(hash: number): ClassType<Template>
	{
		return this.templatesFactory(hash);
	}

}
