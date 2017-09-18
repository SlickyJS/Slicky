import {TemplateRenderFactory} from '@slicky/templates/templates';
import {DirectiveDefinition} from '@slicky/core/metadata';
import {Application} from '../application';


export interface PlatformInterface
{


	compileComponentTemplate(metadata: DirectiveDefinition): TemplateRenderFactory;


	run(application: Application, el: Element): void;

}
