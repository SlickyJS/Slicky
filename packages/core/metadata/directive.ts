import {makeClassDecorator} from '@slicky/reflection';
import {exists} from '@slicky/utils';
import {ClassType} from '@slicky/lang';


export declare interface DirectiveOptions
{
	selector: string,
	exportAs?: string,
	directives?: Array<ClassType<any>>,
	[name: string]: any,
}


export class DirectiveAnnotationDefinition
{


	public _options: DirectiveOptions;

	public selector: string;

	public exportAs: string;

	public directives: Array<ClassType<any>> = [];


	constructor(options: DirectiveOptions)
	{
		this._options = options;
		this.selector = options.selector;

		if (exists(options.exportAs)) {
			this.exportAs = options.exportAs;
		}

		if (exists(options.directives)) {
			this.directives = options.directives;
		}
	}

}


export let Directive = makeClassDecorator(DirectiveAnnotationDefinition);
