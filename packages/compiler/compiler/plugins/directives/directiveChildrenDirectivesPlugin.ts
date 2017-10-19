import {DirectiveDefinitionDirective, DirectiveDefinitionChildrenDirective} from '@slicky/core/metadata';
import {BuilderFunction} from '@slicky/templates-compiler/builder';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {forEach} from '@slicky/utils';
import {AbstractDirectivePlugin, ProcessingDirective} from '../abstractDirectivePlugin';


export class DirectiveChildrenDirectivesPlugin extends AbstractDirectivePlugin
{


	public onSlickyAfterProcessDirective(directive: DirectiveDefinitionDirective, directiveSetup: BuilderFunction, processingDirective: ProcessingDirective, arg: OnProcessElementArgument): void
	{
		forEach(processingDirective.directive.metadata.childrenDirectives, (childrenDirective: DirectiveDefinitionChildrenDirective) => {
			if (directive.directiveType === childrenDirective.directiveType) {
				directiveSetup.body.add(`template.getParameter("@directive_${processingDirective.id}").${childrenDirective.property}.add.emit(directive);`);

				directiveSetup.body.add(
					`template.onDestroy(function() {\n` +
					`	template.getParameter("@directive_${processingDirective.id}").${childrenDirective.property}.remove.emit(directive);\n` +
					`});`
				);
			}
		});
	}

}
