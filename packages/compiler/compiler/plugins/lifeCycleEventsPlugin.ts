import {DirectiveDefinition, DirectiveDefinitionType} from '@slicky/core/metadata';
import {OnProcessElementArgument, OnAfterProcessElementArgument} from '@slicky/templates-compiler';
import {filter, forEach, reverse} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {AbstractSlickyEnginePlugin} from '../abstracSlickyEnginePlugin';
import {ElementProcessingDirective} from '../slickyEnginePlugin';


declare interface ProcessedParentDirective
{
	element: _.ASTHTMLNodeElement;
	id: number;
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


	public onBeforeProcessDirective(element: _.ASTHTMLNodeElement, directive: ElementProcessingDirective, arg: OnProcessElementArgument): void
	{
		if (directive.directive.metadata.onAttach) {
			const useTemplate = directive.directive.metadata.type === DirectiveDefinitionType.Component ?
				'outer' :
				'template'
			;

			forEach(reverse(this.processedParentDirectives), (dir: ProcessedParentDirective) => {
				directive.setup.body.add(`directive.onAttach(${useTemplate}.getParameter("@directive_${dir.id}"));`);
			});

			directive.setup.body.add('directive.onAttach(component);');
		}

		// todo: move to onAfterProcessDirective?
		if (directive.directive.metadata.type === DirectiveDefinitionType.Component) {
			if (directive.directive.metadata.onInit) {
				directive.setup.body.add(
					'template.run(function() {\n' +
					'	directive.onInit();\n' +
					'});'
				);
			}
		}

		if (directive.directive.metadata.onDestroy) {
			directive.setup.body.add(
				'template.onDestroy(function() {\n' +
				'	directive.onDestroy();\n' +
				'});'
			);
		}

		this.processedParentDirectives.push({
			element: element,
			id: directive.id,
		});
	}


	public onAfterProcessDirective(element: _.ASTHTMLNodeElement, directive: ElementProcessingDirective, arg: OnProcessElementArgument): void
	{
		if (directive.directive.metadata.onInit && directive.directive.metadata.type === DirectiveDefinitionType.Directive) {
			arg.render.body.add(`template.getParameter("@directive_${directive.id}").onInit();`);
		}
	}


	public onAfterProcessElement(element: _.ASTHTMLNodeElement, arg: OnAfterProcessElementArgument): void
	{
		this.processedParentDirectives = filter(this.processedParentDirectives, (processedParentDirective: ProcessedParentDirective) => {
			return processedParentDirective.element !== element;
		});
	}

}
