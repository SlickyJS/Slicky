import {Matcher} from '@slicky/query-selector';
import * as _ from '@slicky/html-parser';
import * as tjs from '@slicky/tiny-js';
import {Engine} from './engine';
import {EngineProgress} from './engineProgress';
import * as t from './builder';


export declare interface OnBeforeProcessElementArgument
{
	progress: EngineProgress;
	engine: Engine;
	matcher: Matcher;
}


export declare interface OnExpressionVariableHookArgument
{
	declaration: tjs.ParserVariableDeclaration;
	progress: EngineProgress;
	engine: Engine;
}


export declare interface OnProcessElementArgument
{
	element: t.TemplateNodeElement;
	progress: EngineProgress;
	matcher: Matcher;
	engine: Engine;
}


export declare interface OnProcessTemplateArgument
{
	element: _.ASTHTMLNodeElement;
	template: t.TemplateMethodTemplate;
	comment: t.TemplateNodeComment;
	progress: EngineProgress;
	engine: Engine;
}


export abstract class EnginePlugin
{


	public onBeforeProcessElement(element: _.ASTHTMLNodeElement, arg: OnBeforeProcessElementArgument): _.ASTHTMLNodeElement
	{
		return element;
	}


	public onProcessElement(element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): void
	{
	}


	public onProcessTemplate(arg: OnProcessTemplateArgument): void
	{
	}


	public onExpressionVariableHook(identifier: tjs.ASTCallExpression, arg: OnExpressionVariableHookArgument): tjs.ASTExpression
	{
		return identifier;
	}

}
