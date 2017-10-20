import {makeClassDecorator} from '@slicky/reflection';
import {exists, merge} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {TemplateEncapsulation} from '@slicky/templates/templates';
import {RenderableTemplateFactory} from '@slicky/templates/templates';
import {DirectiveAnnotationDefinition} from './directive';
import {FilterInterface} from '../filters';


export declare interface ComponentOptions
{
	name: string,
	template?: string,
	render?: RenderableTemplateFactory,
	exportAs?: string,
	directives?: Array<ClassType<any>>,
	override?: ClassType<any>,
	filters?: Array<ClassType<FilterInterface>>,
	styles?: Array<string>,
	encapsulation?: TemplateEncapsulation,
	[name: string]: any,
}


export class ComponentAnnotationDefinition extends DirectiveAnnotationDefinition
{


	public template: string;

	public render: RenderableTemplateFactory;

	public filters: Array<ClassType<FilterInterface>> = [];

	public styles: Array<string> = [];

	public encapsulation: TemplateEncapsulation = TemplateEncapsulation.Emulated;


	constructor(options: ComponentOptions)
	{
		super(merge(options, {selector: options.name}));

		if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(options.name) || options.name.indexOf('-') < 0) {
			throw new Error(`Component element name "${options.name}" is not valid. Name must contain a dash and be all lowercased.`);
		}

		if (!exists(options.template) && !exists(options.render)) {
			throw new Error(`Component "${options.name}": missing template or render function.`);
		}

		if (exists(options.template)) {
			this.template = options.template;
		}

		if (exists(options.render)) {
			this.render = options.render;
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


export let Component = makeClassDecorator(ComponentAnnotationDefinition);
