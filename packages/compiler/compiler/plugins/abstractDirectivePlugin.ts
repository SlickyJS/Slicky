import {AbstractPlugin} from '@slicky/templates-compiler';
import {DirectiveDefinitionInnerDirective, DirectiveDefinitionElement, DirectiveDefinitionEvent, DirectiveDefinitionChildDirective} from '@slicky/core/metadata';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import * as _ from '@slicky/html-parser';
import {ElementProcessingDirective} from '../slickyEnginePlugin';


export declare interface ProcessingDirective
{
	id: number;
	directive: DirectiveDefinitionInnerDirective;
	element: _.ASTHTMLNodeElement;
	processedHostElements: Array<DirectiveDefinitionElement>;
	processedHostEvents: Array<DirectiveDefinitionEvent>;
	processedChildDirectives: Array<DirectiveDefinitionChildDirective>;
}


export abstract class AbstractDirectivePlugin extends AbstractPlugin
{


	public onDirectiveInnerElement(directive: ProcessingDirective, element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): void
	{
	}


	public onBeforeProcessDirective(element: _.ASTHTMLNodeElement, directive: ElementProcessingDirective, arg: OnProcessElementArgument): void
	{
	}


	public onProcessDirectiveInParent(element: _.ASTHTMLNodeElement, directive: ElementProcessingDirective, parentProcessingDirective: ProcessingDirective, arg: OnProcessElementArgument): void
	{
	}


	public onAfterElementDirective(directive: ProcessingDirective): void
	{
	}

}
