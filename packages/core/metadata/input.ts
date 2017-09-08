import {makePropertyDecorator} from '@slicky/reflection';


export class InputDefinition
{


	public name: string;


	constructor(name?: string)
	{
		this.name = name;
	}

}


export let Input = makePropertyDecorator(InputDefinition);
