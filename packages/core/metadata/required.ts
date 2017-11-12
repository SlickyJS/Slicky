import {makePropertyDecorator} from '@slicky/reflection';


export class RequiredDefinition
{

}


export type RequiredDecoratorFactory = () => any;
export let Required: RequiredDecoratorFactory = makePropertyDecorator(RequiredDefinition);
