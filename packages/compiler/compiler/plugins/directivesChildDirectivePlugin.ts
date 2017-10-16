import {DirectiveDefinitionDirective, DirectiveDefinitionChildDirective} from '@slicky/core/metadata';
import {BuilderFunction} from '@slicky/templates-compiler/builder';
import {OnProcessElementArgument, OnAfterProcessElementArgument} from '@slicky/templates-compiler';
import {forEach, filter} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {SlickyEnginePlugin} from '../slickyEnginePlugin';
import {ProcessingDirective} from './data';


export class DirectivesChildDirectivePlugin extends SlickyEnginePlugin
{


	private processingDirectives: Array<ProcessingDirective> = [];



	public onSlickyProcessDirective(element: _.ASTHTMLNodeElement, directive: DirectiveDefinitionDirective, directiveId: number, directiveSetup: BuilderFunction, arg: OnProcessElementArgument): void
	{
		this.processingDirectives.push({
			id: directiveId,
			element: element,
			directive: directive,
			processedHostElements: [],
			processedHostEvents: [],
			processedChildDirectives: [],
		});

		if (!arg.progress.inTemplate) {
			forEach(this.processingDirectives, (processingDirective: ProcessingDirective) => {
				forEach(processingDirective.directive.metadata.childDirectives, (childDirective: DirectiveDefinitionChildDirective) => {
					if (processingDirective.processedChildDirectives.indexOf(childDirective) >= 0) {
						return;
					}

					if (directive.directiveType === childDirective.directiveType) {
						processingDirective.processedChildDirectives.push(childDirective);
						directiveSetup.body.add(`template.getParameter("@directive_${processingDirective.id}").${childDirective.property} = directive;`);
					}
				});
			});
		}
	}


	public onSlickyAfterProcessElement(element: _.ASTHTMLNodeElement, arg: OnAfterProcessElementArgument): void
	{
		this.processingDirectives = filter(this.processingDirectives, (directive: ProcessingDirective) => {
			if (directive.element === element) {
				forEach(directive.directive.metadata.childDirectives, (childDirective: DirectiveDefinitionChildDirective) => {
					if (childDirective.required && directive.processedChildDirectives.indexOf(childDirective) < 0) {
						throw new Error(`${directive.directive.metadata.name}.${childDirective.property}: required @ChildDirective ${childDirective.metadata.name} was not found.`);
					}
				});

				return false;
			}

			return true;
		});
	}

}
