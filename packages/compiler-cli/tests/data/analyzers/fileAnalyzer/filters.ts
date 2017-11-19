import {FilterInterface, Filter} from '@slicky/core';


@Filter({
	name: 'not-exported',
})
class NotExportedFilter implements FilterInterface
{


	public transform(value: any): string
	{
		return value.toString();
	}

}


@Filter({
	name: 'exported',
})
export class ExportedFilter implements FilterInterface
{


	public transform(value: any): string
	{
		return value.toString();
	}

}
