import {makePropertyDecorator} from '@slicky/reflection';


export class HostElementDefinition
{


	public selector: string;


	constructor(selector: string)
	{
		this.selector = selector;
	}

}


export let HostElement = makePropertyDecorator(HostElementDefinition);
