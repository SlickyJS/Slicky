import {DirectiveMetadataLoader, DirectiveDefinitionDirective, ElementRef} from '@slicky/core';
import {ClassType} from '@slicky/lang';
import {Container} from '@slicky/di';


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


	public create(hash: number, el: HTMLElement, container: Container): any
	{
		let directiveType = this.directives[hash];

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
