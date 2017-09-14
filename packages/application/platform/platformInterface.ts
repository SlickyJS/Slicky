import {ClassType} from '@slicky/lang';
import {Template} from '@slicky/templates/templates';
import {DirectiveDefinition} from '@slicky/core/metadata';
import {Application} from '../application';


export interface PlatformInterface
{


	compileComponentTemplate(metadata: DirectiveDefinition): ClassType<Template>;


	getTemplateTypeByHash(hash: number): ClassType<Template>;


	run(application: Application, el: HTMLElement): void;

}
