import {AbstractPlugin} from '@slicky/templates-compiler';
import {DirectiveDefinitionDirective, DirectiveDefinitionElement, DirectiveDefinitionEvent, DirectiveDefinitionChildDirective} from '@slicky/core/metadata';
import {BuilderFunction} from '@slicky/templates-compiler/builder';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import * as _ from '@slicky/html-parser';


export declare interface ProcessingDirective
{
	id: number;
	directive: DirectiveDefinitionDirective;
	element: _.ASTHTMLNodeElement;
	processedHostElements: Array<DirectiveDefinitionElement>;
	processedHostEvents: Array<DirectiveDefinitionEvent>;
	processedChildDirectives: Array<DirectiveDefinitionChildDirective>;
}


export abstract class AbstractDirectivePlugin extends AbstractPlugin
{


	public onSlickyCheckDirectiveWithElement(directive: ProcessingDirective, element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): void
	{
	}


	public onSlickyAfterProcessDirective(directive: DirectiveDefinitionDirective, directiveSetup: BuilderFunction, processingDirective: ProcessingDirective, arg: OnProcessElementArgument): void
	{
	}


	public onSlickyFinishDirective(directive: ProcessingDirective): void
	{
	}

}
