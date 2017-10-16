import {DirectiveDefinitionEvent, DirectiveDefinitionType} from '@slicky/core/metadata';
import {forEach} from '@slicky/utils';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
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

}
