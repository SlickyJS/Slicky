import {Component, Input, OnInit} from '@slicky/core';
import {TimeAgoInWords} from '../filters';


@Component({
	selector: 'time-ago-in-words',
	template: '{{ date | timeAgoInWords }}',
	filters: [TimeAgoInWords],
})
export class TimeAgoInWordsComponent implements OnInit
{


	@Input()
	public date: Date;

	@Input()
	public refresh: number = 0;


	public onInit(): void
	{
		if (this.refresh > 0) {
			setInterval(() => {
				void 0;
			}, this.refresh);
		}
	}

}
