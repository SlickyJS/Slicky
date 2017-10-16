import {DirectiveDefinitionDirective, DirectiveDefinitionChildDirective} from '@slicky/core/metadata';
import {BuilderFunction} from '@slicky/templates-compiler/builder';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {forEach} from '@slicky/utils';
import {AbstractDirectivePlugin, ProcessingDirective} from '../abstractDirectivePlugin';


export class DirectiveChildDirectivesPlugin extends AbstractDirectivePlugin
{


	public onSlickyAfterProcessDirective(directive: DirectiveDefinitionDirective, directiveSetup: BuilderFunction, processingDirective: ProcessingDirective, arg: OnProcessElementArgument): void
	{
		forEach(processingDirective.directive.metadata.childDirectives, (childDirective: DirectiveDefinitionChildDirective) => {
			if (processingDirective.processedChildDirectives.indexOf(childDirective) >= 0) {
				return;
			}

			if (directive.directiveType === childDirective.directiveType) {
				processingDirective.processedChildDirectives.push(childDirective);
				directiveSetup.body.add(`template.getParameter("@directive_${processingDirective.id}").${childDirective.property} = directive;`);
			}
		});
	}


	public onSlickyFinishDirective(directive: ProcessingDirective): void
	{
		forEach(directive.directive.metadata.childDirectives, (childDirective: DirectiveDefinitionChildDirective) => {
			if (childDirective.required && directive.processedChildDirectives.indexOf(childDirective) < 0) {
				throw new Error(`${directive.directive.metadata.name}.${childDirective.property}: required @ChildDirective ${childDirective.metadata.name} was not found.`);
			}
		});
	}

}
