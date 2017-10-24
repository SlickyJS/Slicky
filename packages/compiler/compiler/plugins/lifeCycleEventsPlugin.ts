import {DirectiveDefinitionType} from '@slicky/core/metadata';
import {OnProcessElementArgument, OnAfterProcessElementArgument} from '@slicky/templates-compiler';
import {filter, forEach, reverse} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {AbstractSlickyEnginePlugin} from '../abstracSlickyEnginePlugin';
import {ElementProcessingDirective} from '../slickyEnginePlugin';


declare interface ProcessedParentDirective
{
	element: _.ASTHTMLNodeElement;
	directive: ElementProcessingDirective;
}


export class LifeCycleEventsPlugin extends AbstractSlickyEnginePlugin
{


	private processedParentDirectives: Array<ProcessedParentDirective> = [];


	public onBeforeProcessDirective(element: _.ASTHTMLNodeElement, directive: ElementProcessingDirective, arg: OnProcessElementArgument): void
	{
		if (directive.directive.metadata.onAttach) {
			const useTemplate = directive.directive.metadata.type === DirectiveDefinitionType.Component ?
				'outer' :
				'template'
			;

			forEach(reverse(this.processedParentDirectives), (dir: ProcessedParentDirective) => {
				directive.setup.body.add(`directive.onAttach(${useTemplate}.getParameter("@directive_${dir.directive.id}"));`);
			});

			directive.setup.body.add('directive.onAttach(component);');
		}

		// todo: move to onAfterProcessElement?
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
			directive: directive,
		});
	}


	public onAfterProcessElement(element: _.ASTHTMLNodeElement, arg: OnAfterProcessElementArgument): void
	{
		this.processedParentDirectives = filter(this.processedParentDirectives, (processedParentDirective: ProcessedParentDirective) => {
			if (processedParentDirective.element !== element) {
				return true;
			}

			if (processedParentDirective.directive.directive.metadata.onInit && processedParentDirective.directive.directive.metadata.type === DirectiveDefinitionType.Directive) {
				arg.render.body.add(`template.getParameter("@directive_${processedParentDirective.directive.id}").onInit();`);
			}
		});
	}

}
