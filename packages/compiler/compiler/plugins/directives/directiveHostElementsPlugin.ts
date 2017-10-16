import {DirectiveDefinitionElement, DirectiveDefinitionType} from '@slicky/core/metadata';
import {forEach} from '@slicky/utils';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import * as _ from '@slicky/html-parser';
import {AbstractDirectivePlugin, ProcessingDirective} from '../abstractDirectivePlugin';


export class DirectiveHostElementsPlugin extends AbstractDirectivePlugin
{


	public onSlickyCheckDirectiveWithElement(directive: ProcessingDirective, element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): void
	{
		if (directive.directive.metadata.type === DirectiveDefinitionType.Directive) {
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
		}
	}


	public onSlickyFinishDirective(directive: ProcessingDirective): void
	{
		if (directive.directive.metadata.type === DirectiveDefinitionType.Directive) {
			forEach(directive.directive.metadata.elements, (hostElement: DirectiveDefinitionElement) => {
				if (hostElement.required && directive.processedHostElements.indexOf(hostElement) < 0) {
					throw new Error(`${directive.directive.metadata.name}.${hostElement.property}: required @HostElement was not found.`);
				}
			});
		}
	}

}
