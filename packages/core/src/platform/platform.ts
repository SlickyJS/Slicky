import {ClassType} from '@slicky/lang';
import {Template} from '@slicky/templates-runtime';
import {DirectiveDefinition} from '../metadata';


export interface IPlatform
{


	compileComponentTemplate(metadata: DirectiveDefinition): ClassType<Template>;


	getTemplateTypeByHash(hash: number): ClassType<Template>;

}
