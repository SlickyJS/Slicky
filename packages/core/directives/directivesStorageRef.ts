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

}
