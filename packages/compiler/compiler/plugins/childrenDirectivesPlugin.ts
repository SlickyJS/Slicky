import {DirectiveDefinition, DirectiveDefinitionChildrenDirective} from '@slicky/core/metadata';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {forEach} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {AbstractSlickyEnginePlugin} from '../abstractSlickyEnginePlugin';
import {ElementProcessingDirective} from '../slickyEnginePlugin';
import {IsDirectiveInstanceOfFunction} from '../compiler';


export class ChildrenDirectivesPlugin extends AbstractSlickyEnginePlugin
{


	private isDirectiveInstanceOf: IsDirectiveInstanceOfFunction;

	private metadata: DirectiveDefinition;


	constructor(isDirectiveInstanceOf: IsDirectiveInstanceOfFunction, metadata: DirectiveDefinition)
	{
		super();

		this.isDirectiveInstanceOf = isDirectiveInstanceOf;
		this.metadata = metadata;
	}


	public onBeforeProcessDirective(element: _.ASTHTMLNodeElement, directive: ElementProcessingDirective, arg: OnProcessElementArgument): void
	{
		forEach(this.metadata.childrenDirectives, (childrenDirectives: DirectiveDefinitionChildrenDirective) => {
			if (this.isDirectiveInstanceOf(childrenDirectives.directive, directive.directive)) {
				directive.setup.body.add(`component.${childrenDirectives.property}.add.emit(directive);`);

				directive.setup.body.add(
					`template.onDestroy(function() {\n` +
					`	component.${childrenDirectives.property}.remove.emit(directive);\n` +
					`});`
				);
			}
		});
	}

}
