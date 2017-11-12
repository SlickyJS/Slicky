import {makePropertyDecorator} from '@slicky/reflection';
import {ClassType} from '@slicky/lang';


export class ChildrenDirectiveDefinition
{


	public directiveType: ClassType<any>;


	constructor(directiveType: ClassType<any>)
	{
		this.directiveType = directiveType;
	}

}


export type ChildrenDirectiveDecoratorFactory = (directiveType: ClassType<any>) => any;
export let ChildrenDirective: ChildrenDirectiveDecoratorFactory = makePropertyDecorator(ChildrenDirectiveDefinition);
