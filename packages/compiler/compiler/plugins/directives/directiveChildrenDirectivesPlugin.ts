import {DirectiveDefinitionChildrenDirective} from '@slicky/core/metadata';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {forEach} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {AbstractDirectivePlugin, ProcessingDirective} from '../abstractDirectivePlugin';
import {ElementProcessingDirective} from '../../slickyEnginePlugin';
import {IsDirectiveInstanceOfFunction} from '../../compiler';


export class DirectiveChildrenDirectivesPlugin extends AbstractDirectivePlugin
{


	private isDirectiveInstanceOf: IsDirectiveInstanceOfFunction;


	constructor(isDirectiveInstanceOf: IsDirectiveInstanceOfFunction)
	{
		super();

		this.isDirectiveInstanceOf = isDirectiveInstanceOf;
	}


	public onProcessDirectiveInParent(element: _.ASTHTMLNodeElement, directive: ElementProcessingDirective, processingParentDirective: ProcessingDirective, arg: OnProcessElementArgument): void
	{
		forEach(processingParentDirective.directive.metadata.childrenDirectives, (childrenDirective: DirectiveDefinitionChildrenDirective) => {
			if (this.isDirectiveInstanceOf(directive.directive, childrenDirective.directive)) {
				directive.setup.body.add(`template.getParameter("@directive_${processingParentDirective.id}").${childrenDirective.property}.add.emit(directive);`);

				directive.setup.body.add(
					`template.onDestroy(function() {\n` +
					`	template.getParameter("@directive_${processingParentDirective.id}").${childrenDirective.property}.remove.emit(directive);\n` +
					`});`
				);
			}
		});
	}

}
