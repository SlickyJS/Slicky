import {DirectiveDefinitionEvent, DirectiveDefinitionType, DirectiveDefinitionDirective} from '@slicky/core/metadata';
import {forEach, exists} from '@slicky/utils';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {BuilderFunction} from '@slicky/templates-compiler/builder';
import * as _ from '@slicky/html-parser';
import {AbstractDirectivePlugin, ProcessingDirective} from '../abstractDirectivePlugin';


export class DirectiveHostEventsPlugin extends AbstractDirectivePlugin
{


	public onSlickyCheckDirectiveWithElement(directive: ProcessingDirective, element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): void
	{
		if (directive.directive.metadata.type === DirectiveDefinitionType.Directive) {
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
	}


	public onSlickyAfterProcessDirective(directive: DirectiveDefinitionDirective, directiveSetup: BuilderFunction, processingDirective: ProcessingDirective, arg: OnProcessElementArgument): void
	{
		if (directive.metadata.type === DirectiveDefinitionType.Directive) {
			forEach(directive.metadata.events, (hostEvent: DirectiveDefinitionEvent) => {
				if (processingDirective.processedHostEvents.indexOf(hostEvent) >= 0) {
					return;
				}

				if (exists(hostEvent.selector)) {
					return;
				}

				this.writeHostEvent(arg.render, hostEvent, processingDirective.id);

				processingDirective.processedHostEvents.push(hostEvent);
			});
		}
	}


	public onSlickyFinishDirective(directive: ProcessingDirective): void
	{
		if (directive.directive.metadata.type === DirectiveDefinitionType.Directive) {
			forEach(directive.directive.metadata.events, (hostEvent: DirectiveDefinitionEvent) => {
				if (directive.processedHostEvents.indexOf(hostEvent) < 0) {
					throw new Error(`${directive.directive.metadata.name}.${hostEvent.method}: @HostEvent for "${hostEvent.selector}" was not found.`);
				}
			});
		}
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
