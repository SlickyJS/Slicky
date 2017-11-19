import {Filter, FilterInterface} from '@slicky/core';


@Filter({
	name: 'test-filter',
})
class TestFilter implements FilterInterface
{


	public transform(value: any): string
	{
		return value.toString();
	}

}
