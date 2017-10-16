import {DirectiveDefinition, DirectiveDefinitionDirective, DirectiveDefinitionChildDirective} from '@slicky/core/metadata';
import {BuilderFunction} from '@slicky/templates-compiler/builder';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {forEach} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {AbstractSlickyEnginePlugin} from '../abstracSlickyEnginePlugin';


export class ChildDirectivesPlugin extends AbstractSlickyEnginePlugin
{


	private metadata: DirectiveDefinition;

	private processedChildDirectives: Array<DirectiveDefinitionChildDirective> = [];


	constructor(metadata: DirectiveDefinition)
	{
		super();

		this.metadata = metadata;
	}


	public onSlickyProcessDirective(element: _.ASTHTMLNodeElement, directive: DirectiveDefinitionDirective, directiveId: number, directiveSetup: BuilderFunction, arg: OnProcessElementArgument): void
	{
		forEach(this.metadata.childDirectives, (childDirective: DirectiveDefinitionChildDirective) => {
			if (childDirective.directiveType === directive.directiveType && !arg.progress.inTemplate) {
				this.processedChildDirectives.push(childDirective);
				directiveSetup.body.add(`component.${childDirective.property} = directive;`);
			}
		});
	}


	public onSlickyAfterCompile(): void
	{
		forEach(this.metadata.childDirectives, (childDirective: DirectiveDefinitionChildDirective) => {
			if (this.processedChildDirectives.indexOf(childDirective) < 0 && childDirective.required) {
				throw new Error(`${this.metadata.name}.${childDirective.property}: required @ChildDirective ${childDirective.metadata.name} was not found.`);
			}
		});
	}

}
