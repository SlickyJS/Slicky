import {DirectiveDefinitionDirective, DirectiveDefinitionType, DirectiveDefinitionElement, DirectiveDefinitionEvent} from '@slicky/core/metadata';
import {BuilderFunction} from '@slicky/templates-compiler/builder';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {forEach, filter} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {SlickyEnginePlugin} from '../slickyEnginePlugin';
import {ProcessingDirective} from './data';


export class DirectivesPlugin extends SlickyEnginePlugin
{


	private processingDirectives: Array<ProcessingDirective> = [];


	public onSlickyBeforeProcessElement(element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): void
	{
		forEach(this.processingDirectives, (directive: ProcessingDirective) => {
			forEach(directive.directive.metadata.elements, (hostElement: DirectiveDefinitionElement) => {
				if (directive.processedHostElements.indexOf(hostElement) >= 0) {
					return;
				}

				if (!arg.matcher.matches(element, hostElement.selector, directive.element)) {
					return;
				}

				arg.render.body.add(`template.getParameter("@directive_${directive.id}").${hostElement.property} = el._nativeNode;`);

				directive.processedHostElements.push(hostElement);
			});

			forEach(directive.directive.metadata.events, (hostEvent: DirectiveDefinitionEvent) => {
				if (directive.processedHostEvents.indexOf(hostEvent) >= 0) {
					return;
				}

				if (!arg.matcher.matches(element, hostEvent.selector, directive.element)) {
					return;
				}

				arg.render.body.add(
					`el.addEvent("${hostEvent.event}", function($event) {\n` +
					`	template.getParameter("@directive_${directive.id}").${hostEvent.method}($event);\n` +
					`});`
				);

				directive.processedHostEvents.push(hostEvent);
			});
		});
	}


	public onSlickyProcessDirective(element: _.ASTHTMLNodeElement, directive: DirectiveDefinitionDirective, directiveId: number, directiveSetup: BuilderFunction, arg: OnProcessElementArgument): void
	{
		if (directive.metadata.type === DirectiveDefinitionType.Directive) {
			this.processingDirectives.push({
				id: directiveId,
				element: element,
				directive: directive,
				processedHostElements: [],
				processedHostEvents: [],
				processedChildDirectives: [],
			});
		}
	}


	public onSlickyAfterProcessElement(element: _.ASTHTMLNodeElement): void
	{
		this.processingDirectives = filter(this.processingDirectives, (directive: ProcessingDirective) => {
			if (directive.element === element) {
				forEach(directive.directive.metadata.elements, (hostElement: DirectiveDefinitionElement) => {
					if (hostElement.required && directive.processedHostElements.indexOf(hostElement) < 0) {
						throw new Error(`${directive.directive.metadata.name}.${hostElement.property}: required @HostElement was not found.`);
					}
				});

				forEach(directive.directive.metadata.events, (hostEvent: DirectiveDefinitionEvent) => {
					if (directive.processedHostEvents.indexOf(hostEvent) < 0) {
						throw new Error(`${directive.directive.metadata.name}.${hostEvent.method}: @HostEvent for "${hostEvent.selector}" was not found.`);
					}
				});

				return false;
			}

			return true;
		});
	}

}
