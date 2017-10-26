import {DirectiveDefinitionType, DirectiveDefinition} from '@slicky/core/metadata';
import {OnProcessElementArgument, OnAfterProcessElementArgument, OnBeforeCompileArgument, OnAfterCompileArgument} from '@slicky/templates-compiler';
import {filter, forEach, reverse} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {AbstractSlickyEnginePlugin} from '../abstractSlickyEnginePlugin';
import {ElementProcessingDirective} from '../slickyEnginePlugin';


declare interface ProcessedParentDirective
{
	element: _.ASTHTMLNodeElement;
	directive: ElementProcessingDirective;
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


	public onBeforeCompile(arg: OnBeforeCompileArgument): void
	{
		if (this.metadata.onInit) {
			arg.render.body.add(
				'template.run(function() {\n' +
				'	component.onInit();\n' +
				'});'
			);
		}
	}


	public onAfterCompile(arg: OnAfterCompileArgument): void
	{
		if (this.metadata.onTemplateInit) {
			arg.render.body.add(
				'template.run(function() {\n' +
				'	component.onTemplateInit();\n' +
				'});'
			);
		}
	}


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


	public onAfterProcessDirective(element: _.ASTHTMLNodeElement, directive: ElementProcessingDirective, arg: OnProcessElementArgument): void
	{
		if (directive.directive.metadata.onInit && directive.directive.metadata.type === DirectiveDefinitionType.Directive) {
			arg.render.body.add(`template.getParameter("@directive_${directive.id}").onInit();`);
		}
	}


	public onAfterProcessElement(element: _.ASTHTMLNodeElement, arg: OnAfterProcessElementArgument): void
	{
		this.processedParentDirectives = filter(this.processedParentDirectives, (processedParentDirective: ProcessedParentDirective) => {
			if (processedParentDirective.element !== element) {
				return true;
			}

			if (processedParentDirective.directive.directive.metadata.onTemplateInit && processedParentDirective.directive.directive.metadata.type === DirectiveDefinitionType.Directive) {
				arg.render.body.add(`template.getParameter("@directive_${processedParentDirective.directive.id}").onTemplateInit();`);
			}
		});
	}

}
