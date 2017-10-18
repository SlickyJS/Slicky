import {EventEmitter} from '@slicky/event-emitter';


export class ChildrenDirectivesStorage<T>
{


	public add = new EventEmitter<T>();

	public remove = new EventEmitter<T>();

	private _children: Array<T> = [];


	constructor()
	{
		this.add.subscribe((child: T) => {
			this._children.push(child);
		});

		this.remove.subscribe((child: T) => {
			this._children.splice(this._children.indexOf(child), 1);
		});
	}


	get children(): Array<T>
	{
		return this._children;
	}

}
