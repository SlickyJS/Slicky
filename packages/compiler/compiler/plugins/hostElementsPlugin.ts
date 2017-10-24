import {DirectiveDefinition, DirectiveDefinitionElement} from '@slicky/core/metadata';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {forEach} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {AbstractSlickyEnginePlugin} from '../abstracSlickyEnginePlugin';


export class HostElementsPlugin extends AbstractSlickyEnginePlugin
{


	private metadata: DirectiveDefinition;

	private processedHostElements: Array<DirectiveDefinitionElement> = [];


	constructor(metadata: DirectiveDefinition)
	{
		super();

		this.metadata = metadata;
	}


	public onProcessElement(element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): void
	{
		forEach(this.metadata.elements, (hostElement: DirectiveDefinitionElement) => {
			if (!arg.matcher.matches(element, hostElement.selector)) {
				return;
			}

			arg.render.body.add(`component.${hostElement.property} = el._nativeNode;`);

			this.processedHostElements.push(hostElement);
		});
	}


	public onAfterCompile(): void
	{
		forEach(this.metadata.elements, (hostElement: DirectiveDefinitionElement) => {
			if (this.processedHostElements.indexOf(hostElement) < 0 && hostElement.required) {
				throw new Error(`${this.metadata.name}.${hostElement.property}: required @HostElement was not found.`);
			}
		});
	}

}
