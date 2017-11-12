import {exists} from '@slicky/utils';
import {DirectiveDefinition} from '@slicky/core/metadata';
import {ComponentTemplate} from '../templates';


export class RootDirectiveRef<T>
{


	private el: Element;

	private directive: T;

	private metadata: DirectiveDefinition;

	private template: ComponentTemplate;


	constructor(el: Element, directive: T, metadata: DirectiveDefinition, template?: ComponentTemplate)
	{
		this.el = el;
		this.directive = directive;
		this.metadata = metadata;
		this.template = template;
	}


	public getDirective(): T
	{
		return this.directive;
	}


	public hasTemplate(): boolean
	{
		return exists(this.template);
	}


	public getTemplate(): ComponentTemplate
	{
		return this.template;
	}


	public destroy(): void
	{
		if (this.metadata.onDestroy) {
			(<any>this.directive).onDestroy();
		}

		if (this.template) {
			this.template.destroy();
		}

		if (this.el.parentElement) {
			this.el.parentElement.removeChild(this.el);
		}
	}

}
