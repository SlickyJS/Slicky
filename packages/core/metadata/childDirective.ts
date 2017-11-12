import {makePropertyDecorator} from '@slicky/reflection';
import {ClassType} from '@slicky/lang';


export class ChildDirectiveDefinition
{


	public directiveType: ClassType<any>;


	constructor(directiveType: ClassType<any>)
	{
		this.directiveType = directiveType;
	}

}


export type ChildDirectiveDecoratorFactory = (directiveType: ClassType<any>) => any;
export let ChildDirective: ChildDirectiveDecoratorFactory = makePropertyDecorator(ChildDirectiveDefinition);
