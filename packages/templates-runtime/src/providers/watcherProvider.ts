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


	check(): void;


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


	public check(): void
	{
		if (!this.enabled) {
			return;
		}

		forEach(this.watchers, (watcher: Watcher) => {
			let current = watcher.getter();

			if (current !== watcher.current) {
				watcher.update(current);
				watcher.current = current;
			}
		});
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
