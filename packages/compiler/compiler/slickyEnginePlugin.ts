import {AbstractPlugin} from '@slicky/templates-compiler';
import {OnProcessElementArgument, OnAfterProcessElementArgument} from '@slicky/templates-compiler';
import {BuilderFunction} from '@slicky/templates-compiler/builder';
import * as c from '@slicky/core/metadata';
import * as _ from '@slicky/html-parser';


export class SlickyEnginePlugin extends AbstractPlugin
{


	public onSlickyAfterCompile(): void
	{
	}


	public onSlickyBeforeProcessElement(element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): void
	{
	}


	public onSlickyAfterProcessElement(element: _.ASTHTMLNodeElement, arg: OnAfterProcessElementArgument): void
	{
	}


	public onSlickyProcessDirective(element: _.ASTHTMLNodeElement, directive: c.DirectiveDefinitionDirective, directiveId: number, directiveSetup: BuilderFunction, arg: OnProcessElementArgument): void
	{
	}

}
