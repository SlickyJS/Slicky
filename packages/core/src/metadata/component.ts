import {makeClassDecorator} from '@slicky/reflection';
import {exists} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {DirectiveOptions, DirectiveAnnotationDefinition} from './directive';
import {ChangeDetectionStrategy} from '../changeDetection';
import {FilterInterface} from '../filters';


export declare interface ComponentOptions extends DirectiveOptions
{
	controllerAs?: string,
	template: string,
	changeDetection?: ChangeDetectionStrategy,
	directives?: Array<ClassType<any>>,
	filters?: Array<ClassType<FilterInterface>>,
}


export class ComponentAnnotationDefinition extends DirectiveAnnotationDefinition
{


	public controllerAs: string;

	public template: string;

	public changeDetection: ChangeDetectionStrategy = ChangeDetectionStrategy.Default;

	public directives: Array<ClassType<any>> = [];

	public filters: Array<ClassType<FilterInterface>> = [];


	constructor(options: ComponentOptions)
	{
		super(options);

		this.template = options.template;

		if (exists(options.controllerAs)) {
			this.controllerAs = options.controllerAs;
		}

		if (exists(options.changeDetection)) {
			this.changeDetection = options.changeDetection;
		}

		if (exists(options.directives)) {
			this.directives = options.directives;
		}

		if (exists(options.filters)) {
			this.filters = options.filters;
		}
	}

}


export let Component = makeClassDecorator(ComponentAnnotationDefinition);
