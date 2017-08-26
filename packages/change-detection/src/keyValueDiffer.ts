import {getType, isIterable, forEach, find} from '@slicky/utils';
import {DifferInterface} from './differInterface';


export enum KeyValueChangeAction
{
	Add,
	Update,
	Remove,
	Move,
}


export declare interface KeyValueTrackByFunction<K, V>
{
	(item: V, index: K): any,
}


export declare interface KeyValueProperty<K, V>
{
	action: KeyValueChangeAction,
	property: K,
	newValue: V,
	oldValue: V,
}


export declare interface KeyValueChanges<K, V>
{
	size: number,
	forEachAllActions: (iterator: (property: KeyValueProperty<K, V>) => void) => void,
	forEachAllAdded: (iterator: (property: KeyValueProperty<K, V>) => void) => void,
	forEachAllUpdated: (iterator: (property: KeyValueProperty<K, V>) => void) => void,
	forEachAllRemoved: (iterator: (property: KeyValueProperty<K, V>) => void) => void,
	forEachAllMoved: (iterator: (property: KeyValueProperty<K, V>) => void) => void,
}


export declare type KeyValueObject<T> = Array<T>|{[key: string]: T}|{[key: number]: T};


declare interface ObjectProperty<K, V>
{
	key: K,
	value: V,
	trackBy: any,
}


export class KeyValueDiffer<K, V> implements DifferInterface
{


	private trackBy: KeyValueTrackByFunction<K, V>;

	private properties: Array<ObjectProperty<K, V>>;


	constructor(record: KeyValueObject<V>, trackBy?: KeyValueTrackByFunction<K, V>)
	{
		if (!isIterable(record)) {
			throw new Error(`KeyValueDiffer: can not watch unsupported type "${getType(record)}".`);
		}

		this.trackBy = trackBy ? trackBy : (value: V, i: K) => i;
		this.storeCurrentRecord(record);
	}


	public check(record: KeyValueObject<V>): KeyValueChanges<K, V>
	{
		let changes = this.compare(record);

		if (changes.size) {
			this.storeCurrentRecord(record);
		}

		return changes;
	}


	private compare(record: KeyValueObject<V>): KeyValueChanges<K, V>
	{
		let result: Array<KeyValueProperty<K, V>> = [];
		let moved: Array<KeyValueProperty<K, V>> = [];

		forEach(this.properties, (property: ObjectProperty<K, V>) => {
			let current = this.getCurrentProperty(record, property);

			if (current === null) {
				result.push({
					action: KeyValueChangeAction.Remove,
					property: property.key,
					newValue: undefined,
					oldValue: property.value,
				});
			}
		});

		forEach(record, (value: V|any, key: K|any) => {
			let previous = this.getPreviousProperty(key, value);

			if (!previous) {
				result.push({
					action: KeyValueChangeAction.Add,
					property: key,
					newValue: value,
					oldValue: undefined,
				});

			} else if (previous.value !== value) {
				result.push({
					action: KeyValueChangeAction.Update,
					property: key,
					newValue: value,
					oldValue: previous.value,
				});

			} else if (previous.key !== key) {
				let movedItem = {
					action: KeyValueChangeAction.Move,
					property: key,
					newValue: key,
					oldValue: previous.key,
				};

				result.push(<any>movedItem);
				moved.push(<any>movedItem);
			}
		});

		moved.reverse();

		return {
			size: result.length,
			forEachAllActions: (iterator: (property: KeyValueProperty<K, V>) => void) => {
				forEach(result, (property: KeyValueProperty<K, V>) => {
					iterator(property);
				});
			},
			forEachAllAdded: (iterator: (property: KeyValueProperty<K, V>) => void) => {
				forEach(result, (property: KeyValueProperty<K, V>) => {
					if (property.action === KeyValueChangeAction.Add) {
						iterator(property);
					}
				});
			},
			forEachAllUpdated: (iterator: (property: KeyValueProperty<K, V>) => void) => {
				forEach(result, (property: KeyValueProperty<K, V>) => {
					if (property.action === KeyValueChangeAction.Update) {
						iterator(property);
					}
				});
			},
			forEachAllRemoved: (iterator: (property: KeyValueProperty<K, V>) => void) => {
				forEach(result, (property: KeyValueProperty<K, V>) => {
					if (property.action === KeyValueChangeAction.Remove) {
						iterator(property);
					}
				});
			},
			forEachAllMoved: (iterator: (property: KeyValueProperty<K, V>) => void) => {
				forEach(moved, (property: KeyValueProperty<K, V>) => {
					if (property.action === KeyValueChangeAction.Move) {
						iterator(property);
					}
				});
			},
		};
	}


	private getCurrentProperty(record: KeyValueObject<V>, property: ObjectProperty<K, V>): {key: K, value: V}
	{
		let current = null;

		find(record, (value: V|any, key: K|any) => {
			if (this.trackBy(value, key) === property.trackBy) {
				current = {
					key: key,
					value: value,
				};

				return true;
			}
		});

		return current;
	}


	private getPreviousProperty(key: K, value: V): ObjectProperty<K, V>
	{
		return find(this.properties, (property: ObjectProperty<K, V>) => {
			if (property.trackBy === this.trackBy(value, key)) {
				return true;
			}
		}) || null;
	}


	private storeCurrentRecord(record: KeyValueObject<V>): void
	{
		this.properties = [];

		forEach(record, (value: V|any, index: K|any) => {
			this.properties.push({
				key: index,
				value: value,
				trackBy: this.trackBy(value, index),
			});
		});
	}

}
