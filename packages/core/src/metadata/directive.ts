import {makeClassDecorator} from '@slicky/reflection';
import {exists} from '@slicky/utils';


export declare interface DirectiveOptions
{
	selector: string,
	exportAs?: string,
	[name: string]: any,
}


export class DirectiveAnnotationDefinition
{


	public _options: DirectiveOptions;

	public selector: string;

	public exportAs: string;


	constructor(options: DirectiveOptions)
	{
		this._options = options;
		this.selector = options.selector;

		if (exists(options.exportAs)) {
			this.exportAs = options.exportAs;
		}
	}

}


export let Directive = makeClassDecorator(DirectiveAnnotationDefinition);
