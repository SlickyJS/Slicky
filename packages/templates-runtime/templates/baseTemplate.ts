import {Realm} from '@slicky/realm';
import {forEach, exists} from '@slicky/utils';
import {ApplicationTemplate} from './applicationTemplate';


export type TemplateFilterCallback = (obj: any, args: Array<any>) => any;


export abstract class BaseTemplate
{


	protected parent: BaseTemplate;

	protected children: Array<BaseTemplate> = [];

	protected application: ApplicationTemplate;

	protected realm: Realm;

	private providers: {[name: string]: any} = {};

	private providersFromParent: boolean = true;

	private parameters: {[name: string]: any} = {};

	private parametersFromParent: boolean = true;

	private filters: {[name: string]: TemplateFilterCallback} = {};

	private filtersFromParent: boolean = true;

	private onDestroyed: Array<() => void> = [];


	constructor(application: ApplicationTemplate = null, parent: BaseTemplate = null)
	{
		this.application = application;
		this.parent = parent;
		this.realm = new Realm(null, () => this.refresh(), this.parent ? this.parent.realm : null);

		if (this.parent) {
			this.parent.children.push(this);
		}
	}


	public abstract refresh(): void;


	public init(): void
	{
	}


	public destroy(): void
	{
		forEach(this.children, (child: BaseTemplate) => {
			child.destroy();
		});

		forEach(this.onDestroyed, (fn: () => void) => {
			fn();
		});

		if (this.parent) {
			this.parent.children.splice(this.parent.children.indexOf(this), 1);
			this.parent = null;
		}

		this.children = [];
		this.onDestroyed = [];
	}


	public run(fn: () => any): any
	{
		this.realm.run(fn);
	}


	public onDestroy(fn: () => void): void
	{
		this.onDestroyed.push(fn);
	}


	public addProvider(name: string, provider: any): void
	{
		this.providers[name] = provider;
	}


	public disableProvidersFromParent(): void
	{
		this.providersFromParent = false;
	}


	public getProvider(name: string): any
	{
		if (exists(this.providers[name])) {
			return this.providers[name];
		}

		if (this.providersFromParent && this.parent !== null) {
			return this.providers[name] = this.parent.getProvider(name);
		}

		if (this.application) {
			return this.providers[name] = this.application.getProvider(name);
		}

		return undefined;
	}


	public disableParametersFromParent(): void
	{
		this.parametersFromParent = false;
	}


	public setParameters(parameters: {[name: string]: any}): void
	{
		this.parameters = parameters;
	}


	public setParameter(name: string, value: any): void
	{
		this.parameters[name] = value;
	}


	public getParameter(name: string): any
	{
		if (exists(this.parameters[name])) {
			return this.parameters[name];
		}

		if (this.parametersFromParent && this.parent !== null) {
			return this.parent.getParameter(name);
		}

		if (this.application !== null) {
			return this.parameters[name] = this.application.getParameter(name);
		}

		return undefined;
	}


	public disableFiltersFromParent(): void
	{
		this.filtersFromParent = false;
	}


	public addFilter(name: string, fn: TemplateFilterCallback): void
	{
		this.filters[name] = fn;
	}


	public getFilter(name: string, need: boolean = true): TemplateFilterCallback
	{
		if (exists(this.filters[name])) {
			return this.filters[name];
		}

		if (this.filtersFromParent && this.parent !== null) {
			return this.filters[name] = this.parent.getFilter(name, false);
		}

		if (this.application) {
			return this.filters[name] = this.application.getFilter(name, false);
		}

		if (need) {
			throw new Error(`Filter "${name}" is not registered.`);
		}

		return undefined;
	}


	public callFilter(name: string, modify: any, args: Array<any> = []): any
	{
		return this.getFilter(name)(modify, args);
	}

}