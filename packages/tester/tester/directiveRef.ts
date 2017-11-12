import {ComponentTemplate} from '@slicky/core/templates';
import {ApplicationRef} from './applicationRef';


export class DirectiveRef<T>
{


	private _application: ApplicationRef;

	private _directive: T;

	private _template: ComponentTemplate;


	constructor(application: ApplicationRef, directive: T, template?: ComponentTemplate)
	{
		this._application = application;
		this._directive = directive;
		this._template = template;
	}


	get application(): ApplicationRef
	{
		return this._application;
	}


	get directive(): T
	{
		return this._directive;
	}


	get template(): ComponentTemplate
	{
		return this._template;
	}

}
