import {findAnnotation, findParameterMetadata} from '@slicky/reflection';
import {stringify, find} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {InjectableDefinition, InjectDefinition} from '../metadata';


declare let Reflect: any;


export declare interface ServiceOptions
{
	useClass?: ClassType<any>,
	useValue?: any,
	useFactory?: (container: Container) => any,
	useExisting?: ClassType<any>,
}


export declare interface ProviderOptions
{
	service: any,
	options?: ServiceOptions,
}


export declare interface Service
{
	type: ClassType<any>,
	options: ServiceOptions,
	instance: any,
	providers: Array<ProviderOptions>,
}


export class Container
{


	private parent: Container;

	private services: Array<Service> = [];


	constructor(parent?: Container)
	{
		this.parent = parent;

		this.addService(Container, {
			useValue: this,
		});
	}


	public addService(type: ClassType<any>, options: ServiceOptions = {}): void
	{
		let realType = options.useClass ? options.useClass : type;

		if (!options.useExisting && !options.useFactory && !options.useValue && !findAnnotation(realType, InjectableDefinition)) {
			if (realType === type) {
				throw new Error(`DI: Can not register service "${stringify(type)}" without @Injectable() annotation.`);
			} else {
				throw new Error(`DI: Can not register service "${stringify(type)}". Class "${stringify(realType)}" is without @Injectable() annotation.`);
			}
		}

		this.services.push({
			type: type,
			options: options,
			instance: undefined,
			providers: [],
		});
	}


	public get(type: ClassType<any>): any
	{
		let service = this.findService(type);

		if (!service) {
			throw new Error(`DI: Service of type "${stringify(type)}" is not registered in DI container.`);
		}

		if (typeof service.instance === 'undefined') {
			service.instance = this.createInstance(service);
		}

		return service.instance;
	}


	public create(type: ClassType<any>, providers: Array<ProviderOptions> = []): any
	{
		return this.createInstance({
			type: type,
			options: {},
			instance: undefined,
			providers: providers,
		});
	}


	public fork(): Container
	{
		return new Container(this);
	}


	protected findService(type: ClassType<any>): Service
	{
		for (let i = 0; i < this.services.length; i++) {
			let service = this.services[i];

			if (type === service.type || service.type.prototype instanceof type) {
				return service;
			}
		}

		if (this.parent) {
			return this.parent.findService(type);
		}

		return null;
	}


	private createInstance(service: Service): any
	{
		if (service.options.useValue) {
			return service.options.useValue;
		}

		if (service.options.useExisting) {
			return this.get(service.options.useExisting);
		}

		if (service.options.useFactory) {
			return service.options.useFactory(this);
		}

		let type = service.type;

		if (service.options.useClass) {
			type = service.options.useClass;
		}

		let inject = this.getParameters(type, service.providers);

		let construct = function(constructor, args) {
			function F(): void {
				let result = constructor.apply(this, args);
				if (result) {
					return result;
				}
			}

			F.prototype = constructor.prototype;

			return new F;
		};

		return construct(type, inject);
	}


	private getParameters(type: ClassType<any>, providers: Array<ProviderOptions>): Array<any>
	{
		let params = Reflect.getMetadata('design:paramtypes', type) || [];
		let inject = [];

		for (let i = 0; i < params.length; i++) {
			let injectMetadata: InjectDefinition = findParameterMetadata(type, InjectDefinition, i);
			let injectType = injectMetadata && injectMetadata.type ? injectMetadata.type : params[i];

			let dependency = this.findProvider(injectType, providers) || this.findService(injectType);

			if (!dependency) {
				throw new Error(`DI: can not create instance of "${stringify(type)}". Service depends on unknown service "${stringify(params[i])}".`);
			}

			if (typeof dependency.instance === 'undefined') {
				dependency.instance = this.createInstance(dependency);
			}

			inject.push(dependency.instance);
		}

		return inject;
	}


	private findProvider(type: ClassType<any>, providers: Array<ProviderOptions>): Service
	{
		let provider = find(providers, (provider: ProviderOptions) => {
			return type === provider.service || provider.service.prototype instanceof type;
		});

		if (!provider) {
			return null;
		}

		return {
			type: provider.service,
			options: provider.options || {},
			instance: undefined,
			providers: [],
		};
	}

}
