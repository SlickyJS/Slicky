import {FilterInterface, Filter} from '@slicky/core';
import * as moment from 'moment';


@Filter({
	name: 'timeAgoInWords',
})
export class TimeAgoInWords implements FilterInterface
{


	transform(value: Date, ...args: Array<any>): string
	{
		return moment(value).fromNow();
	}

}
