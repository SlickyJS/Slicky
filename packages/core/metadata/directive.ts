import {makeClassDecorator} from '@slicky/reflection';
import {exists, isString} from '@slicky/utils';
import {ClassType} from '@slicky/lang';


export declare interface DirectiveOptions
{
	selector: string,
	exportAs?: string|Array<string>,
	directives?: Array<any>,
	override?: ClassType<any>,
	id?: string,
	[name: string]: any,
}


export class DirectiveAnnotationDefinition
{


	public _options: DirectiveOptions;

	public selector: string;

	public exportAs: Array<string>;

	public override: ClassType<any>;

	public directives: Array<ClassType<any>> = [];

	public id: string;


	constructor(options: DirectiveOptions)
	{
		this._options = options;
		this.selector = options.selector;

		if (exists(options.exportAs)) {
			this.exportAs = isString(options.exportAs) ? [<string>options.exportAs] : <Array<string>>options.exportAs;
		}

		if (exists(options.directives)) {
			this.directives = options.directives;
		}

		if (exists(options.override)) {
			this.override = options.override;
		}

		if (exists(options.id)) {
			this.id = options.id;
		}
	}

}


export type DirectiveDecoratorFactory = (options: DirectiveOptions) => any;
export const Directive: DirectiveDecoratorFactory = makeClassDecorator(DirectiveAnnotationDefinition);
