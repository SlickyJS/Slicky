import {DirectiveMetadataLoader, DirectiveDefinitionDirective, DirectiveDefinition, ElementRef} from '@slicky/core';
import {ClassType} from '@slicky/lang';
import {Container} from '@slicky/di';
import {isFunction} from '@slicky/utils';


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


	public create(hash: number, el: HTMLElement, container: Container, setup: (directive: any) => void = null): any
	{
		let directiveType = this.directives[hash].directiveType;
		let directive = container.create(directiveType, [
			{
				service: ElementRef,
				options: {
					useFactory: () => ElementRef.getForElement(el),
				},
			},
		]);

		if (isFunction(setup)) {
			setup(directive);
		}

		return directive;
	}

}
