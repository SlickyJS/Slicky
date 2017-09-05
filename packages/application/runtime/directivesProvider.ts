import {ElementRef} from '@slicky/core';
import {ExtensionsManager} from '@slicky/core/extensions';
import {DirectiveMetadataLoader, DirectiveDefinitionDirective, DirectiveDefinition} from '@slicky/core/metadata';
import {ClassType} from '@slicky/lang';
import {Container, ProviderOptions} from '@slicky/di';
import {isFunction} from '@slicky/utils';


export class DirectivesProvider
{


	private extensions: ExtensionsManager;

	private directives: {[hash: number]: DirectiveDefinitionDirective} = {};


	constructor(extensions: ExtensionsManager, metadataLoader: DirectiveMetadataLoader)
	{
		this.extensions = extensions;

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


	public create(hash: number, el: HTMLElement, container: Container, providers: Array<ProviderOptions> = [], setup: (directive: any) => void = null): any
	{
		providers.push({
			service: ElementRef,
			options: {
				useFactory: () => ElementRef.getForElement(el),
			},
		});

		let directiveType = this.directives[hash].directiveType;
		let metadata = this.directives[hash].metadata;

		this.extensions.doUpdateDirectiveServices(directiveType, metadata, providers);

		let directive = container.create(directiveType, providers);

		if (isFunction(setup)) {
			setup(directive);
		}

		return directive;
	}

}
