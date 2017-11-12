import {makePropertyDecorator} from '@slicky/reflection';


export class InputDefinition
{


	public name: string;


	constructor(name?: string)
	{
		this.name = name;
	}

}


export type InputDecoratorFactory = (name?: string) => any;
export let Input: InputDecoratorFactory = makePropertyDecorator(InputDefinition);
