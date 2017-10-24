import {AbstractPlugin} from '@slicky/templates-compiler';
import {OnProcessElementArgument, OnAfterProcessElementArgument} from '@slicky/templates-compiler';
import * as _ from '@slicky/html-parser';
import {ElementProcessingDirective} from './slickyEnginePlugin';


export abstract class AbstractSlickyEnginePlugin extends AbstractPlugin
{


	public onAfterCompile(): void
	{
	}


	public onProcessElement(element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): void
	{
	}


	public onAfterProcessElement(element: _.ASTHTMLNodeElement, arg: OnAfterProcessElementArgument): void
	{
	}


	public onBeforeProcessDirective(element: _.ASTHTMLNodeElement, directive: ElementProcessingDirective, arg: OnProcessElementArgument): void
	{
	}


	public onProcessDirective(element: _.ASTHTMLNodeElement, directive: ElementProcessingDirective, arg: OnProcessElementArgument): void
	{
	}


	public onAfterProcessDirective(element: _.ASTHTMLNodeElement, directive: ElementProcessingDirective, arg: OnProcessElementArgument): void
	{
	}

}
