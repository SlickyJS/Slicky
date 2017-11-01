import {Realm} from '@slicky/realm';


export class RealmRef
{


	private realm: Realm;


	public _initialize(realm: Realm): void
	{
		if (this.realm) {
			throw new Error('RealmRef is already initialized.');
		}

		this.realm = realm;
	}


	public isReady(): boolean
	{
		return !!this.realm;
	}


	public run(fn: () => any): any
	{
		if (!this.isReady()) {
			throw new Error('RealmRef is not yet initialized.');
		}

		return this.realm.run(fn);
	}


	public runOutside(fn: () => any): any
	{
		if (!this.isReady()) {
			throw new Error('RealmRef is not yet initialized.');
		}

		return this.realm.runOutside(fn);
	}

}
