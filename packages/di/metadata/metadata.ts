import {makeClassDecorator, makeParameterDecorator} from '@slicky/reflection';
import {ClassType} from '@slicky/lang';


export class InjectableDefinition
{

}


export class InjectDefinition
{


	public type: ClassType<any>;


	constructor(type?: ClassType<any>)
	{
		this.type = type;
	}

}


export let Injectable = makeClassDecorator(InjectableDefinition);
export let Inject = makeParameterDecorator(InjectDefinition);
