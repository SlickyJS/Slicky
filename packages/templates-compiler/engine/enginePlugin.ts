import {Matcher} from '@slicky/query-selector';
import * as _ from '@slicky/html-parser';
import * as tjs from '@slicky/tiny-js';
import {Engine, EngineCompileOptions} from './';
import {EngineProgress, EngineProgressTemplate} from './engineProgress';
import * as b from '../builder';


export declare interface OnBeforeCompileArgument
{
	progress: EngineProgress,
	engine: Engine,
	options: EngineCompileOptions,
	render: b.BuilderFunction,
}


export declare interface OnAfterCompileArgument
{
	progress: EngineProgress,
	engine: Engine,
	options: EngineCompileOptions,
	render: b.BuilderFunction,
}


export declare interface OnExpressionVariableHookArgument
{
	declaration: tjs.ParserVariableDeclaration;
	progress: EngineProgress;
	engine: Engine;
}


export declare interface OnBeforeProcessElementArgument
{
	progress: EngineProgress;
	engine: Engine;
	matcher: Matcher;
	stopProcessing: () => void;
}


export declare interface OnProcessElementArgument
{
	progress: EngineProgress;
	matcher: Matcher;
	engine: Engine;
	render: b.BuilderFunction;
}


export declare interface OnAfterProcessElementArgument
{
	progress: EngineProgress;
	matcher: Matcher;
	engine: Engine;
	render: b.BuilderFunction;
}


export declare interface OnProcessTemplateArgument
{
	element: _.ASTHTMLNodeElement;
	template: EngineProgressTemplate;
	progress: EngineProgress;
	engine: Engine;
	render: b.BuilderFunction;
	renderTemplate: b.BuilderFunction;
}


export abstract class EnginePlugin
{


	public onBeforeCompile(arg: OnBeforeCompileArgument): void
	{
	}


	public onAfterCompile(arg: OnAfterCompileArgument): void
	{
	}


	public onBeforeProcessElement(element: _.ASTHTMLNodeElement, arg: OnBeforeProcessElementArgument): _.ASTHTMLNodeElement
	{
		return element;
	}


	public onProcessElement(element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): void
	{
	}


	public onAfterProcessElement(element: _.ASTHTMLNodeElement, arg: OnAfterProcessElementArgument): void
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
