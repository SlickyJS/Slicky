import {DirectiveDefinition, DirectiveDefinitionChildrenDirective} from '@slicky/core/metadata';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {forEach} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {AbstractSlickyEnginePlugin} from '../abstractSlickyEnginePlugin';
import {ElementProcessingDirective} from '../slickyEnginePlugin';


export class ChildrenDirectivesPlugin extends AbstractSlickyEnginePlugin
{


	private metadata: DirectiveDefinition;


	constructor(metadata: DirectiveDefinition)
	{
		super();

		this.metadata = metadata;
	}


	public onBeforeProcessDirective(element: _.ASTHTMLNodeElement, directive: ElementProcessingDirective, arg: OnProcessElementArgument): void
	{
		forEach(this.metadata.childrenDirectives, (childrenDirectives: DirectiveDefinitionChildrenDirective) => {
			if (childrenDirectives.directive.directiveType === directive.directive.directiveType) {
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
