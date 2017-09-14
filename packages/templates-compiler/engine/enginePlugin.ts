import {Matcher} from '@slicky/query-selector';
import * as _ from '@slicky/html-parser';
import * as tjs from '@slicky/tiny-js';
import {Engine, EngineCompileOptions} from './';
import {EngineProgress} from './engineProgress';
import * as b from '../builder';


export declare interface OnBeforeCompileArgument
{
	progress: EngineProgress,
	engine: Engine,
	options: EngineCompileOptions,
	builder: b.TemplateBuilder,
}


export declare interface OnAfterCompileArgument
{
	progress: EngineProgress,
	engine: Engine,
	options: EngineCompileOptions,
	builder: b.TemplateBuilder,
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
	builder: b.TemplateBuilder,
	stopProcessing: () => void;
}


export declare interface OnProcessElementArgument
{
	element: b.BuilderAddElement;
	progress: EngineProgress;
	matcher: Matcher;
	engine: Engine;
	builder: b.TemplateBuilder,
}


export declare interface OnAfterProcessElementArgument
{
	progress: EngineProgress;
	engine: Engine;
	matcher: Matcher;
	builder: b.TemplateBuilder,
}


export declare interface OnProcessTemplateArgument
{
	element: _.ASTHTMLNodeElement;
	template: b.BuilderTemplateMethod;
	comment: b.BuilderAddComment;
	progress: EngineProgress;
	engine: Engine;
	builder: b.TemplateBuilder,
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
