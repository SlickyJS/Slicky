import {DirectiveDefinitionEvent, DirectiveDefinitionType} from '@slicky/core/metadata';
import {forEach, exists} from '@slicky/utils';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {BuilderFunction} from '@slicky/templates-compiler/builder';
import * as _ from '@slicky/html-parser';
import {AbstractDirectivePlugin, ProcessingDirective} from '../abstractDirectivePlugin';
import {ElementProcessingDirective} from '../../slickyEnginePlugin';


export class DirectiveHostEventsPlugin extends AbstractDirectivePlugin
{


	public onBeforeProcessDirective(element: _.ASTHTMLNodeElement, directive: ElementProcessingDirective, arg: OnProcessElementArgument): void
	{
		if (directive.directive.metadata.type !== DirectiveDefinitionType.Directive) {
			return
		}

		forEach(directive.directive.metadata.events, (hostEvent: DirectiveDefinitionEvent) => {
			if (exists(hostEvent.selector)) {
				return;
			}

			this.writeHostEvent(arg.render, hostEvent, directive.id);
		});
	}


	public onDirectiveInnerElement(directive: ProcessingDirective, element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): void
	{
		if (directive.directive.metadata.type !== DirectiveDefinitionType.Directive) {
			return;
		}

		forEach(directive.directive.metadata.events, (hostEvent: DirectiveDefinitionEvent) => {
			if (directive.processedHostEvents.indexOf(hostEvent) >= 0) {
				return;
			}

			if (!exists(hostEvent.selector)) {
				return;
			}

			if (!arg.matcher.matches(element, hostEvent.selector, directive.element)) {
				return;
			}

			this.writeHostEvent(arg.render, hostEvent, directive.id);

			directive.processedHostEvents.push(hostEvent);
		});
	}


	public onAfterElementDirective(directive: ProcessingDirective): void
	{
		if (directive.directive.metadata.type !== DirectiveDefinitionType.Directive) {
			return;
		}

		forEach(directive.directive.metadata.events, (hostEvent: DirectiveDefinitionEvent) => {
			if (!exists(hostEvent.selector)) {
				return;
			}

			if (directive.processedHostEvents.indexOf(hostEvent) < 0) {
				throw new Error(`${directive.directive.metadata.className}.${hostEvent.method}: @HostEvent for "${hostEvent.selector}" was not found.`);
			}
		});
	}


	private writeHostEvent(render: BuilderFunction, hostEvent: DirectiveDefinitionEvent, directiveId: number): void
	{
		render.body.add(
			`el.addEvent("${hostEvent.event}", function($event) {\n` +
			`	template.getParameter("@directive_${directiveId}").${hostEvent.method}($event);\n` +
			`});`
		);
	}

}
