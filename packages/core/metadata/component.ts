import {makeClassDecorator} from '@slicky/reflection';
import {exists} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {DirectiveOptions, DirectiveAnnotationDefinition} from './directive';
import {FilterInterface} from '../filters';


export declare interface ComponentOptions extends DirectiveOptions
{
	template: string,
	precompileDirectives?: Array<ClassType<any>>,
	directives?: Array<ClassType<any>>,
	filters?: Array<ClassType<FilterInterface>>,
	styles?: Array<string>,
}


export class ComponentAnnotationDefinition extends DirectiveAnnotationDefinition
{


	public template: string;

	public precompileDirectives: Array<ClassType<any>> = [];

	public directives: Array<ClassType<any>> = [];

	public filters: Array<ClassType<FilterInterface>> = [];

	public styles: Array<string> = [];


	constructor(options: ComponentOptions)
	{
		super(options);

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
	}

}


export let Component = makeClassDecorator(ComponentAnnotationDefinition);
