import {find, isFunction, clone} from '@slicky/utils';
import {DifferInterface, DifferTrackByFn, DifferAction, DifferChange} from './differ';


export class ListDiffer<T> implements DifferInterface<T>
{


	private copy: Array<T> = [];

	private trackBy: DifferTrackByFn<T>;


	constructor(list: Array<T>, trackBy: DifferTrackByFn<T> = null)
	{
		if (!isFunction(trackBy)) {
			trackBy = (value: T, index: number) => index;
		}

		this.trackBy = trackBy;
		this.copy = clone(list);
	}


	public check(list: Array<T>): Array<DifferChange<T>>
	{
		let changes: Array<DifferChange<T>> = [];
		let i;

		i = 0;
		while (i < this.copy.length) {
			let previous = this.copy[i];
			let previousTrackBy = this.trackBy(previous, i);
			let current = this.findInItems(list, previousTrackBy);

			if (!current) {
				changes.push({
					action: DifferAction.Remove,
					previousIndex: i,
					previousItem: previous,
					currentIndex: undefined,
					currentItem: undefined,
				});

				this.copy.splice(i, 1);

			} else {
				i++;
			}
		}

		i = 0;
		while (i < list.length) {
			let current = list[i];
			let currentTrackBy = this.trackBy(current, i);
			let previous = this.findInItems(this.copy, currentTrackBy);

			if (!previous) {
				changes.push({
					action: DifferAction.Add,
					previousIndex: undefined,
					previousItem: undefined,
					currentIndex: i,
					currentItem: current,
				});

				this.copy.splice(i, 0, current);

			} else {
				if (current !== previous.item) {
					changes.push({
						action: DifferAction.Update,
						previousIndex: previous.index,
						previousItem: previous.item,
						currentIndex: i,
						currentItem: current,
					});

					this.copy[i] = current;

				} else if (i !== previous.index) {
					changes.push({
						action: DifferAction.Move,
						previousIndex: previous.index,
						previousItem: previous.item,
						currentIndex: i,
						currentItem: current,
					});

					this.copy.splice(i, 0, this.copy.splice(previous.index, 1)[0]);
				}

				i++;
			}
		}

		return changes;
	}


	private findInItems(items: Array<T>, trackBy: any): {index: number, item: T}
	{
		let found: {index: number, item: T};

		find(items, (item: T, index: number) => {
			let itemTrackBy = this.trackBy(item, index);

			if (itemTrackBy === trackBy) {
				return found = {
					index: index,
					item: item,
				};
			}
		});

		return found;
	}

}
