import {DifferInterface} from './differInterface';


export declare interface SimpleDifferChange<T>
{
	newValue: T,
	oldValue: T,
}


export class SimpleDiffer<T> implements DifferInterface
{


	private record: T;


	constructor(record: T)
	{
		this.refresh(record);
	}


	public check(record: T): SimpleDifferChange<T>
	{
		if (record !== this.record) {
			let change: SimpleDifferChange<T> = {
				newValue: record,
				oldValue: this.record,
			};

			this.refresh(record);

			return change;
		}
	}


	private refresh(record: T): void
	{
		this.record = record;
	}

}
