import {makePropertyDecorator} from '@slicky/reflection';


export class OutputDefinition
{


	public name: string;


	constructor(name?: string)
	{
		this.name = name;
	}

}


export type OutputDecoratorFactory = (name?: string) => any;
export let Output: OutputDecoratorFactory = makePropertyDecorator(OutputDefinition);
