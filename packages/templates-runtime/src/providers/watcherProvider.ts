import {forEach} from '@slicky/utils';


declare interface Watcher
{
	current: any;
	getter: () => any;
	update: (value: any) => void;
}


export interface IWatcherProvider
{


	disable(): void;


	check(): boolean;


	watch(getter: () => any, update: (value: any) => void): void;

}


export class DefaultWatcherProvider implements IWatcherProvider
{


	private watchers: Array<Watcher> = [];

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

		forEach(this.watchers, (watcher: Watcher) => {
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
