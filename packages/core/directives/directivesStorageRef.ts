import {find, filter} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {DirectivesStorage} from './directivesStorage';


export class DirectivesStorageRef
{


	private storage: DirectivesStorage;


	constructor(storage: DirectivesStorage)
	{
		this.storage = storage;
	}


	get directives(): Array<any>
	{
		return this.storage.getDirectives();
	}


	public find<T>(directiveType: ClassType<T>): T
	{
		return find(this.storage.getDirectives(), (directive: any) => {
			return directive instanceof directiveType;
		});
	}


	public findAll<T>(directiveType: ClassType<T>): Array<T>
	{
		return filter(this.storage.getDirectives(), (directive: any) => {
			return directive instanceof directiveType;
		});
	}

}
