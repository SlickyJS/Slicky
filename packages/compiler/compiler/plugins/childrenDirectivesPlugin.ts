import {DirectiveDefinitionDirective, DirectiveDefinition, DirectiveDefinitionChildrenDirective} from '@slicky/core/metadata';
import {BuilderFunction} from '@slicky/templates-compiler/builder';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {forEach} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {AbstractSlickyEnginePlugin} from '../abstracSlickyEnginePlugin';


export class ChildrenDirectivesPlugin extends AbstractSlickyEnginePlugin
{


	private metadata: DirectiveDefinition;


	constructor(metadata: DirectiveDefinition)
	{
		super();

		this.metadata = metadata;
	}


	public onSlickyProcessDirective(element: _.ASTHTMLNodeElement, directive: DirectiveDefinitionDirective, directiveId: number, directiveSetup: BuilderFunction, arg: OnProcessElementArgument): void
	{
		forEach(this.metadata.childrenDirectives, (childrenDirectives: DirectiveDefinitionChildrenDirective) => {
			if (childrenDirectives.directiveType === directive.directiveType) {
				directiveSetup.body.add(`component.${childrenDirectives.property}.add.emit(directive);`);

				directiveSetup.body.add(
					`template.onDestroy(function() {\n` +
					`	component.${childrenDirectives.property}.remove.emit(directive);\n` +
					`});`
				);
			}
		});
	}

}
