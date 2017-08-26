import {DirectiveMetadataLoader, DirectiveDefinitionDirective} from '@slicky/core';
import {ClassType} from '@slicky/lang';


export class DirectivesProvider
{


	private directives: {[hash: number]: ClassType<any>} = {};


	constructor(metadataLoader: DirectiveMetadataLoader)
	{
		metadataLoader.loaded.subscribe((directive: DirectiveDefinitionDirective) => {
			this.directives[directive.metadata.hash] = directive.directiveType;
		});
	}


	public getDirectiveTypeByHash(hash: number): ClassType<any>
	{
		return this.directives[hash];
	}

}
