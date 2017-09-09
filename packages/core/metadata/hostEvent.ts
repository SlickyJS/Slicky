import {makePropertyDecorator} from '@slicky/reflection';


export class HostEventDefinition
{


	public event: string;

	public selector: string;


	constructor(event: string, selector?: string)
	{
		this.event = event;
		this.selector = selector;
	}

}


export let HostEvent = makePropertyDecorator(HostEventDefinition);
