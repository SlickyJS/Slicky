import {forEach, isFunction} from '@slicky/utils';
import {Observable} from 'rxjs';


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


	public check(done?: (changed: boolean) => void): void
	{
		if (!this.enabled || !this.watchers.length) {
			if (isFunction(done)) {
				done(false);
			}

			return;
		}

		const total = this.watchers.length;

		let i = 0;
		let changed = false;

		forEach(this.watchers, (watcher: WatcherItem) => {
			i++;

			this.getCurrent(watcher.getter, (current) => {
				if (current !== watcher.current) {
					watcher.update(current);
					watcher.current = current;
					changed = true;
				}

				if (i === total && isFunction(done)) {
					done(changed);
				}
			});
		});
	}


	public watch(getter: () => any, update: (value: any) => void): void
	{
		if (!this.enabled) {
			return;
		}

		this.getCurrent(getter, (current) => {
			this.watchers.push({
				current: current,
				getter: getter,
				update: update,
			});

			update(current);
		});
	}


	private getCurrent(getter: () => any, cb: (current: any) => void): void
	{
		const current = getter();

		if (current instanceof Observable) {
			current.subscribe(cb);
		} else {
			cb(current);
		}
	}

}
