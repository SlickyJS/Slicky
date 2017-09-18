import {forEach} from '@slicky/utils';


declare interface WatcherItem
{
	current: any;
	getter: () => any;
	update: (value: any) => void;
}


export class Watcher
{


	private watchers: Array<WatcherItem> = [];

	private enabled: boolean = true;


	public disable(): void
	{
		this.enabled = false;
	}


	public check(): boolean
	{
		if (!this.enabled) {
			return false;
		}

		let changed = false;

		forEach(this.watchers, (watcher: WatcherItem) => {
			let current = watcher.getter();

			if (current !== watcher.current) {
				watcher.update(current);
				watcher.current = current;

				changed = true;
			}
		});

		return changed;
	}


	public watch(getter: () => any, update: (value: any) => void): void
	{
		if (!this.enabled) {
			return;
		}

		let current = getter();

		update(current);

		this.watchers.push({
			current: current,
			getter: getter,
			update: update,
		});
	}

}
