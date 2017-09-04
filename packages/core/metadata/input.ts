import {makePropertyDecorator} from '@slicky/reflection';


export class InputDefinition
{


	public name: string;


	constructor(name?: string)
	{
		this.name = name;
	}

}


export class RequiredInputDefinition
{

}


export let Input = makePropertyDecorator(InputDefinition);
export let Required = makePropertyDecorator(RequiredInputDefinition);
