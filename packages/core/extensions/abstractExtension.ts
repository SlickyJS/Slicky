import {Container, ProviderOptions} from '@slicky/di';
import {ClassType} from '@slicky/lang';
import {DirectiveDefinition, DirectiveOptions} from '../metadata';
import {FilterInterface} from '../filters';


export abstract class AbstractExtension
{


	public getServices(): Array<ProviderOptions>
	{
		return [];
	}


	public getFilters(): Array<ClassType<FilterInterface>>
	{
		return [];
	}


	public getPrecompileDirectives(): Array<ClassType<any>>
	{
		return [];
	}


	public doUpdateDirectiveMetadata(directiveType: ClassType<any>, metadata: DirectiveDefinition, options: DirectiveOptions): void
	{
	}


	public doUpdateDirectiveServices(directiveType: ClassType<any>, metadata: DirectiveDefinition, services: Array<ProviderOptions>): void
	{
	}


	public doInitComponentContainer(container: Container, metadata: DirectiveDefinition, component: any): void
	{
	}

}
