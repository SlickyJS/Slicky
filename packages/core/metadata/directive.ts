import {makeClassDecorator} from '@slicky/reflection';
import {exists} from '@slicky/utils';
import {ClassType} from '@slicky/lang';


export declare interface DirectiveOptions
{
	selector: string,
	exportAs?: string,
	directives?: Array<ClassType<any>>,
	override?: ClassType<any>,
	[name: string]: any,
}


export class DirectiveAnnotationDefinition
{


	public _options: DirectiveOptions;

	public selector: string;

	public exportAs: string;

	public override: ClassType<any>;

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

		if (exists(options.override)) {
			this.override = options.override;
		}
	}

}


export let Directive = makeClassDecorator(DirectiveAnnotationDefinition);
