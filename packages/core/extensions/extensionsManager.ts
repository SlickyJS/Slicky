import {forEach, merge} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {Container, ProviderOptions} from '@slicky/di';
import {AbstractExtension} from './abstractExtension';
import {DirectiveDefinition, DirectiveOptions} from '../metadata';
import {FilterInterface} from '../filters';


export class ExtensionsManager
{


	private extensions: Array<AbstractExtension> = [];


	public addExtension(extension: AbstractExtension): void
	{
		this.extensions.push(extension);
	}


	public getServices(): Array<ProviderOptions>
	{
		let services = [];

		forEach(this.extensions, (extension: AbstractExtension) => {
			services = merge(services, extension.getServices());
		});

		return services;
	}


	public getFilters(): Array<ClassType<FilterInterface>>
	{
		let filters = [];

		forEach(this.extensions, (extension: AbstractExtension) => {
			filters = merge(filters, extension.getFilters());
		});

		return filters;
	}


	public doUpdateDirectiveMetadata(directiveType: ClassType<any>, metadata: DirectiveDefinition, options: DirectiveOptions): void
	{
		this.callHook('doUpdateDirectiveMetadata', directiveType, metadata, options);
	}


	public doUpdateDirectiveServices(directiveType: ClassType<any>, metadata: DirectiveDefinition, services: Array<ProviderOptions>): void
	{
		this.callHook('doUpdateDirectiveServices', directiveType, metadata, services);
	}


	public doInitComponentContainer(container: Container, metadata: DirectiveDefinition, component: any): void
	{
		this.callHook('doInitComponentContainer', container, metadata, component);
	}


	private callHook(name: string, ...args: Array<any>): void
	{
		forEach(this.extensions, (extension: AbstractExtension) => {
			extension[name](...args);
		});
	}

}
