import {DirectiveMetadataLoader, DirectiveDefinitionDirective, DirectiveDefinition, ElementRef} from '@slicky/core';
import {ClassType} from '@slicky/lang';
import {Container} from '@slicky/di';


export class DirectivesProvider
{


	private directives: {[hash: number]: DirectiveDefinitionDirective} = {};


	constructor(metadataLoader: DirectiveMetadataLoader)
	{
		metadataLoader.loaded.subscribe((directive: DirectiveDefinitionDirective) => {
			this.directives[directive.metadata.hash] = directive;
		});
	}


	public getDirectiveTypeByHash(hash: number): ClassType<any>
	{
		return this.directives[hash].directiveType;
	}


	public getDirectiveMetadataByHash(hash: number): DirectiveDefinition
	{
		return this.directives[hash].metadata;
	}


	public create(hash: number, el: HTMLElement, container: Container): any
	{
		let directiveType = this.directives[hash].directiveType;

		return container.create(directiveType, [
			{
				service: ElementRef,
				options: {
					useFactory: () => ElementRef.getForElement(el),
				},
			},
		]);
	}

}
