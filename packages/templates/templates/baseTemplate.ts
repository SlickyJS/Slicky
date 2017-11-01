import {exists, forEach} from '@slicky/utils';
import {Realm} from '@slicky/realm';
import {Template} from './template';
import {ApplicationTemplate} from './applicationTemplate';
import {Watcher} from './watcher';


export type TemplateParametersList = {[name: string]: any};
export type TemplateFilterCallback = (obj: any, ...args: Array<any>) => any;


export abstract class BaseTemplate
{


	public root: Template;

	public parent: BaseTemplate;

	public realm: Realm;

	protected application: ApplicationTemplate;

	protected children: Array<BaseTemplate> = [];

	protected initialized: boolean = false;

	protected useParentParameters: boolean = true;

	protected useRefreshFromParent: boolean = true;

	protected useFiltersFromParent: boolean = true;

	private watcher: Watcher;

	private parameters: TemplateParametersList;

	private filters: {[name: string]: TemplateFilterCallback} = {};

	private onDestroyed: Array<() => void> = [];


	constructor(application?: ApplicationTemplate, root?: Template, parent?: BaseTemplate, parameters: TemplateParametersList = {})
	{
		this.application = application;
		this.root = root;
		this.parent = parent;
		this.parameters = parameters;

		this.realm = new Realm(null, () => this.refresh(), this.parent ? this.parent.realm : null);
		this.watcher = new Watcher;

		if (this.parent) {
			this.parent.children.push(this);
		}
	}


	public onDestroy(fn: () => void): void
	{
		this.onDestroyed.push(fn);
	}


	public destroy(): void
	{
		forEach(this.children, (child: BaseTemplate) => {
			child.destroy();
		});

		forEach(this.onDestroyed, (fn: () => void) => {
			fn();
		});

		this.children = [];
		this.onDestroyed = [];
		this.watcher.disable();
		this.initialized = false;
	}


	public refresh(caller?: BaseTemplate): void
	{
		if (!this.initialized) {
			return;
		}

		if (!caller && this !== <any>this.root) {
			return this.root.refresh();
		}

		this.watcher.check();

		forEach(this.children, (child: BaseTemplate) => {
			if (child.useRefreshFromParent) {
				child.refresh(this);
			}
		});
	}


	public run(fn: () => any): any
	{
		this.realm.run(fn);
	}


	public watch(getter: () => any, update: (value: any) => void): void
	{
		this.watcher.watch(getter, update);
	}


	public eachChild(iterator: (child: BaseTemplate, index: number) => void): void
	{
		forEach(this.children, iterator);
	}


	public getParameter(name: string): any
	{
		if (exists(this.parameters[name])) {
			return this.parameters[name];
		}

		if (exists(this.parent) && this.useParentParameters) {
			return this.parent.getParameter(name);
		}
	}


	public setParameter(name: string, value: any): void
	{
		this.parameters[name] = value;
	}


	public setDynamicParameter(name: string, valueCallback: () => any): void
	{
		this.watch(valueCallback, (value) => {
			this.setParameter(name, value);
		});
	}


	public updateParameter(name: string, update: (value: any) => any): void
	{
		if (exists(this.parameters[name])) {
			this.setParameter(name, update(this.getParameter(name)));

		} else if (exists(this.parent) && this.useParentParameters) {
			this.parent.updateParameter(name, update);
		}
	}


	public removeParameter(name: string): void
	{
		if (exists(this.parameters[name])) {
			delete this.parameters[name];
		}
	}


	public setParameters(parameters: TemplateParametersList): void
	{
		forEach(parameters, (value: any, name: string) => {
			this.setParameter(name, value);
		});
	}


	public addFilter(name: string, filter: TemplateFilterCallback): void
	{
		this.filters[name] = filter;
	}


	public getFilter(name: string, needed: boolean = true): TemplateFilterCallback
	{
		if (exists(this.filters[name])) {
			return this.filters[name];
		}

		if (this.useFiltersFromParent && exists(this.parent)) {
			let filter = this.parent.getFilter(name, false);

			if (filter) {
				return this.filters[name] = filter;
			}
		}

		if (exists(this.application)) {
			let filter = this.application.getFilter(name, false);

			if (filter) {
				return this.filters[name] = filter;
			}
		}

		if (needed) {
			throw new Error(`Filter "${name}" does not exists.`);
		}
	}


	public filter(name: string, modify: any, ...args: Array<any>): any
	{
		return this.getFilter(name)(modify, ...args);
	}

}
