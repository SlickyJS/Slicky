import {makePropertyDecorator} from '@slicky/reflection';


export class OutputDefinition
{


	public name: string;


	constructor(name?: string)
	{
		this.name = name;
	}

}


export let Output = makePropertyDecorator(OutputDefinition);
