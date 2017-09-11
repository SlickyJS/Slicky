import {makeClassDecorator} from '@slicky/reflection';
import {exists, merge} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {TemplateEncapsulation} from '@slicky/templates-runtime/templates';
import {DirectiveAnnotationDefinition} from './directive';
import {FilterInterface} from '../filters';


export declare interface ComponentOptions
{
	name: string,
	template: string,
	exportAs?: string,
	precompileDirectives?: Array<ClassType<any>>,
	directives?: Array<ClassType<any>>,
	filters?: Array<ClassType<FilterInterface>>,
	styles?: Array<string>,
	encapsulation?: TemplateEncapsulation,
	[name: string]: any,
}


export class ComponentAnnotationDefinition extends DirectiveAnnotationDefinition
{


	public template: string;

	public precompileDirectives: Array<ClassType<any>> = [];

	public directives: Array<ClassType<any>> = [];

	public filters: Array<ClassType<FilterInterface>> = [];

	public styles: Array<string> = [];

	public encapsulation: TemplateEncapsulation = TemplateEncapsulation.Emulated;


	constructor(options: ComponentOptions)
	{
		super(merge(options, {selector: options.name}));

		if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(options.name) || options.name.indexOf('-') < 0) {
			throw new Error(`Component element name "${options.name}" is not valid. Name must contain a dash and be all lowercased.`);
		}

		this.template = options.template;

		if (exists(options.precompileDirectives)) {
			this.precompileDirectives = options.precompileDirectives;
		}

		if (exists(options.directives)) {
			this.directives = options.directives;
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
