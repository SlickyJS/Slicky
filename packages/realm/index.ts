/// <reference types="zone.js"/>


export class Realm
{


	private zone: Zone;

	private onEnter: () => void;

	private onLeave: () => void;


	constructor(onEnter?: () => void, onLeave?: () => void, parent?: Realm)
	{
		if (!Zone) {
			throw new Error('Please, install the zone.js polyfill.');
		}

		this.onEnter = onEnter;
		this.onLeave = onLeave;

		let parentZone = parent ? parent.zone : Zone.current;

		this.zone = parentZone.fork({
			name: 'slicky_realm',
			onInvoke: (delegate: ZoneDelegate, current: Zone, target: Zone, callback: Function, applyThis: any, applyArgs: Array<any>, source: string): any => {
				try {
					if (this.onEnter && current === target) this.onEnter();
					return delegate.invoke(target, callback, applyThis, applyArgs, source);
				} finally {
					if (this.onLeave && current === target) this.onLeave();
				}
			},
			onInvokeTask: (delegate: ZoneDelegate, current: Zone, target: Zone, task: Task, applyThis: any, applyArgs: any): any => {
				try {
					if (this.onEnter && current === target) this.onEnter();
					return delegate.invokeTask(target, task, applyThis, applyArgs);
				} finally {
					if (this.onLeave && current === target) this.onLeave();
				}
			},
		});
	}


	public run(fn: () => any): any
	{
		return this.zone.run(fn);
	}


	public fork(onEnter?: () => void, onLeave?: () => void): Realm
	{
		return new Realm(onEnter, onLeave, this);
	}

}
