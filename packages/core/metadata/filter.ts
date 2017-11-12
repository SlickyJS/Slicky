import {makeClassDecorator} from '@slicky/reflection';


export declare interface FilterOptions
{
	name: string,
}


export class FilterDefinition
{


	public name: string;


	constructor(options: FilterOptions)
	{
		this.name = options.name;
	}

}


export type FilterDecoratorFactory = (options: FilterOptions) => any;
export let Filter: FilterDecoratorFactory = makeClassDecorator(FilterDefinition);
