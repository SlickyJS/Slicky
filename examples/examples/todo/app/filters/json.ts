import {Filter, FilterInterface} from '@slicky/core';


@Filter({
	name: 'json',
})
export class JsonFilter implements FilterInterface
{


	public transform(value: any): string
	{
		return JSON.stringify(value);
	}

}
