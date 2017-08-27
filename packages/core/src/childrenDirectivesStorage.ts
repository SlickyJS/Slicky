import {EventEmitter} from '@slicky/event-emitter';


export class ChildrenDirectivesStorage<T>
{


	public add = new EventEmitter<T>();

	public remove = new EventEmitter<T>();

}
