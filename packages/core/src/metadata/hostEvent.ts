import {makePropertyDecorator} from '@slicky/reflection';
import {exists} from '@slicky/utils';


export class HostEventDefinition
{


	public selector: string;

	public event: string;


	constructor(selectorOrEvent: string, event?: string)
	{
		if (exists(event)) {
			this.selector = selectorOrEvent;
			this.event = event;
		} else {
			this.event = selectorOrEvent;
		}
	}

}


export let HostEvent = makePropertyDecorator(HostEventDefinition);
