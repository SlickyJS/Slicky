import {DirectiveDefinition, DirectiveDefinitionChildDirective} from '@slicky/core/metadata';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {forEach} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {AbstractSlickyEnginePlugin} from '../abstractSlickyEnginePlugin';
import {ElementProcessingDirective} from '../slickyEnginePlugin';


export class ChildDirectivesPlugin extends AbstractSlickyEnginePlugin
{


	private metadata: DirectiveDefinition;

	private processedChildDirectives: Array<DirectiveDefinitionChildDirective> = [];


	constructor(metadata: DirectiveDefinition)
	{
		super();

		this.metadata = metadata;
	}


	public onBeforeProcessDirective(element: _.ASTHTMLNodeElement, directive: ElementProcessingDirective, arg: OnProcessElementArgument): void
	{
		forEach(this.metadata.childDirectives, (childDirective: DirectiveDefinitionChildDirective) => {
			if (childDirective.directive.directiveType === directive.directive.directiveType && !arg.progress.inTemplate) {
				this.processedChildDirectives.push(childDirective);
				directive.setup.body.add(`component.${childDirective.property} = directive;`);
			}
		});
	}


	public onAfterCompile(): void
	{
		forEach(this.metadata.childDirectives, (childDirective: DirectiveDefinitionChildDirective) => {
			if (this.processedChildDirectives.indexOf(childDirective) < 0 && childDirective.required) {
				throw new Error(`${this.metadata.className}.${childDirective.property}: required @ChildDirective ${childDirective.directive.metadata.className} was not found.`);
			}
		});
	}

}
