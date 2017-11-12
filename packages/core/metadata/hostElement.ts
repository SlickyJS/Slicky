import {makePropertyDecorator} from '@slicky/reflection';


export class HostElementDefinition
{


	public selector: string;


	constructor(selector: string)
	{
		this.selector = selector;
	}

}


export type HostElementDecoratorFactory = (selector: string) => any;
export let HostElement: HostElementDecoratorFactory = makePropertyDecorator(HostElementDefinition);
