import {DirectiveDefinitionChildDirective} from '@slicky/core/metadata';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {forEach} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {AbstractDirectivePlugin, ProcessingDirective} from '../abstractDirectivePlugin';
import {ElementProcessingDirective} from '../../slickyEnginePlugin';


export class DirectiveChildDirectivesPlugin extends AbstractDirectivePlugin
{


	public onProcessDirectiveInParent(element: _.ASTHTMLNodeElement, directive: ElementProcessingDirective, parentProcessingDirective: ProcessingDirective, arg: OnProcessElementArgument): void
	{
		forEach(parentProcessingDirective.directive.metadata.childDirectives, (childDirective: DirectiveDefinitionChildDirective) => {
			if (parentProcessingDirective.processedChildDirectives.indexOf(childDirective) >= 0) {
				return;
			}

			if (directive.directive.directiveType === childDirective.directiveType) {
				parentProcessingDirective.processedChildDirectives.push(childDirective);
				directive.setup.body.add(`template.getParameter("@directive_${parentProcessingDirective.id}").${childDirective.property} = directive;`);
			}
		});
	}


	public onAfterElementDirective(directive: ProcessingDirective): void
	{
		forEach(directive.directive.metadata.childDirectives, (childDirective: DirectiveDefinitionChildDirective) => {
			if (childDirective.required && directive.processedChildDirectives.indexOf(childDirective) < 0) {
				throw new Error(`${directive.directive.metadata.name}.${childDirective.property}: required @ChildDirective ${childDirective.metadata.name} was not found.`);
			}
		});
	}

}
