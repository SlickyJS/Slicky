import {makeClassDecorator} from '@slicky/reflection';
import {exists} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {TemplateEncapsulation} from '@slicky/templates/templates';
import {DirectiveOptions, DirectiveAnnotationDefinition} from './directive';
import {FilterInterface} from '../filters';
import {ComponentTemplateRenderFactory} from '../templates';


export declare interface ComponentOptions extends DirectiveOptions
{
	template?: string|ComponentTemplateRenderFactory,
	filters?: Array<ClassType<FilterInterface>>,
	styles?: Array<string>,
	encapsulation?: TemplateEncapsulation,
}


export class ComponentAnnotationDefinition extends DirectiveAnnotationDefinition
{


	public template: string|ComponentTemplateRenderFactory;

	public filters: Array<ClassType<FilterInterface>> = [];

	public styles: Array<string> = [];

	public encapsulation: TemplateEncapsulation = TemplateEncapsulation.Emulated;


	constructor(options: ComponentOptions)
	{
		super(options);

		if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(this.selector) || this.selector.indexOf('-') < 0) {
			throw new Error(`Component selector "${options.selector}" is not valid. Selector must contain a dash and be all lowercased.`);
		}

		if (!exists(options.template) && !exists(options.render)) {
			throw new Error(`Component "${options.selector}": missing template.`);
		}

		if (exists(options.template)) {
			this.template = options.template;
		}

		if (exists(options.filters)) {
			this.filters = options.filters;
		}

		if (exists(options.styles)) {
			this.styles = options.styles;
		}

		if (exists(options.encapsulation)) {
			this.encapsulation = options.encapsulation;
		}
	}

}


export type ComponentDecoratorFactory = (options: ComponentOptions) => any;
export let Component: ComponentDecoratorFactory = makeClassDecorator(ComponentAnnotationDefinition);
