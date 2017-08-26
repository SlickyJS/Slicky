import {clone, exists, forEach, find} from '@slicky/utils';


export enum IterableChangeAction
{
	Add,
	Remove,
}


export declare interface IterableProperty<V>
{
	action: IterableChangeAction,
	value: V,
}


export declare interface IterableChanges<V>
{
	forEachAllActions: (iterator: (property: IterableProperty<V>) => void) => void,
	forEachAllAdded: (iterator: (property: IterableProperty<V>) => void) => void,
	forEachAllRemoved: (iterator: (property: IterableProperty<V>) => void) => void,
}


export declare type IterableObject<T> = Array<T>|{[key: string]: T}|{[key: number]: T};


export class IterableDiffer<T>
{


	private record: IterableObject<T>;


	constructor(record: IterableObject<T>)
	{
		this.refresh(record);
	}


	public check(record: IterableObject<T>): IterableChanges<T>
	{
		let changes = this.compare(record);

		if (changes) {
			this.refresh(record);
		}

		return changes;
	}


	private compare(record: IterableObject<T>): IterableChanges<T>
	{
		let result: Array<IterableProperty<T>> = [];

		forEach(this.record, (previous: T) => {
			if (!exists(find(record, (current: T) => previous === current))) {
				result.push({
					action: IterableChangeAction.Remove,
					value: previous,
				});
			}
		});

		forEach(record, (current: T) => {
			if (!exists(find(this.record, (previous: T) => current === previous))) {
				result.push({
					action: IterableChangeAction.Add,
					value: current,
				});
			}
		});

		if (!result.length) {
			return;
		}

		return {
			forEachAllActions: (iterator: (property: IterableProperty<T>) => void) => {
				forEach(result, (property: IterableProperty<T>) => {
					iterator(property);
				});
			},
			forEachAllAdded: (iterator: (property: IterableProperty<T>) => void) => {
				forEach(result, (property: IterableProperty<T>) => {
					if (property.action === IterableChangeAction.Add) {
						iterator(property);
					}
				});
			},
			forEachAllRemoved: (iterator: (property: IterableProperty<T>) => void) => {
				forEach(result, (property: IterableProperty<T>) => {
					if (property.action === IterableChangeAction.Remove) {
						iterator(property);
					}
				});
			},
		};
	}


	private refresh(record: IterableObject<T>): void
	{
		this.record = clone(record);
	}

}
