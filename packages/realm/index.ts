/// <reference types="zone.js"/>


export class Realm
{


	protected zone: Zone;

	protected outerZone: Zone;

	private onEnter: (realm: Realm) => void;

	private onLeave: (realm: Realm) => void;


	constructor(onEnter?: (realm: Realm) => void, onLeave?: (realm: Realm) => void, parent?: Realm)
	{
		if (!Zone) {
			throw new Error('Please, install the zone.js polyfill.');
		}

		this.outerZone = parent ? parent.outerZone : Zone.current.fork({
			name: 'slicky_realm_outer',
		});

		this.onEnter = onEnter;
		this.onLeave = onLeave;

		let parentZone = parent ? parent.zone : Zone.current;

		this.zone = parentZone.fork({
			name: 'slicky_realm',
			onInvoke: (delegate: ZoneDelegate, current: Zone, target: Zone, callback: Function, applyThis: any, applyArgs: Array<any>, source: string): any => {
				try {
					if (this.onEnter && current === target) this.onEnter(this);
					return delegate.invoke(target, callback, applyThis, applyArgs, source);
				} finally {
					if (this.onLeave && current === target) this.onLeave(this);
				}
			},
			onInvokeTask: (delegate: ZoneDelegate, current: Zone, target: Zone, task: Task, applyThis: any, applyArgs: any): any => {
				try {
					if (this.onEnter && current === target) this.onEnter(this);
					return delegate.invokeTask(target, task, applyThis, applyArgs);
				} finally {
					if (this.onLeave && current === target) this.onLeave(this);
				}
			},
		});
	}


	public run(fn: () => any): any
	{
		return this.zone.run(fn);
	}


	public runOutside(fn: () => any): any
	{
		return this.outerZone.run(fn);
	}


	public fork(onEnter?: (parent: Realm) => void, onLeave?: (parent: Realm) => void): Realm
	{
		return new Realm(onEnter, onLeave, this);
	}

}
