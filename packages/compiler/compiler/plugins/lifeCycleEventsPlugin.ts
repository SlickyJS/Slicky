import {DirectiveDefinition, DirectiveDefinitionDirective, DirectiveDefinitionType} from '@slicky/core/metadata';
import {BuilderFunction} from '@slicky/templates-compiler/builder';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {filter, forEach, reverse} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {AbstractSlickyEnginePlugin} from '../abstracSlickyEnginePlugin';


declare interface ProcessedParentDirective
{
	element: _.ASTHTMLNodeElement;
	directiveId: number;
}


export class LifeCycleEventsPlugin extends AbstractSlickyEnginePlugin
{


	private metadata: DirectiveDefinition;

	private processedParentDirectives: Array<ProcessedParentDirective> = [];


	constructor(metadata: DirectiveDefinition)
	{
		super();

		this.metadata = metadata;
	}


	public onSlickyProcessDirective(element: _.ASTHTMLNodeElement, directive: DirectiveDefinitionDirective, directiveId: number, directiveSetup: BuilderFunction, arg: OnProcessElementArgument): void
	{
		if (directive.metadata.onAttach) {
			const useTemplate = directive.metadata.type === DirectiveDefinitionType.Component ?
				'outer' :
				'template'
			;

			forEach(reverse(this.processedParentDirectives), (dir: ProcessedParentDirective) => {
				directiveSetup.body.add(`directive.onAttach(${useTemplate}.getParameter("@directive_${dir.directiveId}"));`);
			});

			directiveSetup.body.add('directive.onAttach(component);');
		}

		if (directive.metadata.type === DirectiveDefinitionType.Component) {
			if (directive.metadata.onInit) {
				directiveSetup.body.add(
					'template.run(function() {\n' +
					'	directive.onInit();\n' +
					'});'
				);
			}

		} else if (directive.metadata.onInit) {
			directiveSetup.body.add('directive.onInit();');
		}

		if (directive.metadata.onDestroy) {
			directiveSetup.body.add(
				'template.onDestroy(function() {\n' +
				'	directive.onDestroy();\n' +
				'});'
			);
		}

		this.processedParentDirectives.push({
			element: element,
			directiveId: directiveId,
		});
	}


	public onSlickyAfterProcessElement(element: _.ASTHTMLNodeElement): void
	{
		this.processedParentDirectives = filter(this.processedParentDirectives, (processedParentDirective: ProcessedParentDirective) => {
			return processedParentDirective.element !== element;
		});
	}

}
