import {ClassType} from '@slicky/lang';
import {exists, forEach} from '@slicky/utils';


export class DirectiveTypesProvider
{


	private parent: DirectiveTypesProvider;

	private storage: {[id: string]: ClassType<any>} = {};


	constructor(directives: {[id: string]: ClassType<any>} = {}, parent?: DirectiveTypesProvider)
	{
		this.parent = parent;
		this.registerInnerDirectives(directives);
	}


	public registerInnerDirectives(directives: {[id: string]: ClassType<any>}): void
	{
		forEach(directives, (directiveType: ClassType<any>, id: string) => {
			this.storage[id] = directiveType;
		});
	}


	public getDirectiveTypeByName(id: string, need: boolean = true): ClassType<any>
	{
		if (exists(this.storage[id])) {
			return this.storage[id];
		}

		let directiveType: ClassType<any> = undefined;

		if (this.parent) {
			directiveType = this.parent.getDirectiveTypeByName(id, false);
		}

		if (!directiveType && need) {
			throw new Error(`DirectiveTypesProvider: directive "${id}" does not exists.`);
		}

		return directiveType ? this.storage[id] = directiveType : undefined;
	}


	public fork(): DirectiveTypesProvider
	{
		return new DirectiveTypesProvider({}, this);
	}

}
