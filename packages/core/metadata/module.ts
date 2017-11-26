import {ClassType} from '@slicky/lang';
import {exists} from '@slicky/utils';
import {makeClassDecorator} from '@slicky/reflection';


export declare interface ModuleOptions
{
	directives: Array<ClassType<any>>,
}


export class ModuleDefinition
{


	public directives: Array<ClassType<any>> = [];


	constructor(options: ModuleOptions)
	{
		if (exists(options.directives)) {
			this.directives = options.directives;
		}
	}

}



export type ModuleDecoratorFactory = (options: ModuleOptions) => any;
export const Module: ModuleDecoratorFactory = makeClassDecorator(ModuleDefinition);
