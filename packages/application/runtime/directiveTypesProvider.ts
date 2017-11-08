import {ClassType} from '@slicky/lang';
import {DirectiveDefinitionInnerDirective} from '@slicky/core/metadata';
import {exists, forEach} from '@slicky/utils';


export class DirectiveTypesProvider
{


	private parent: DirectiveTypesProvider;

	private storage: {[id: string]: ClassType<any>} = {};


	constructor(directives: Array<DirectiveDefinitionInnerDirective> = [], parent?: DirectiveTypesProvider)
	{
		this.parent = parent;
		this.registerInnerDirectives(directives);
	}


	public registerInnerDirectives(directives: Array<DirectiveDefinitionInnerDirective>): void
	{
		forEach(directives, (directive: DirectiveDefinitionInnerDirective) => {
			this.storage[directive.metadata.id] = directive.directiveType;
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
		return new DirectiveTypesProvider([], this);
	}

}
