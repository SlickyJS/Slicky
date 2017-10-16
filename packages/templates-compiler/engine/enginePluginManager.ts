import * as _ from '@slicky/html-parser';
import * as tjs from '@slicky/tiny-js';
import {
	EnginePlugin, OnBeforeCompileArgument, OnAfterCompileArgument, OnBeforeProcessElementArgument,
	OnAfterProcessElementArgument, OnExpressionVariableHookArgument, OnProcessTemplateArgument,
	OnProcessElementArgument
} from './enginePlugin';
import {AbstractPluginManager} from './abstractPluginManager';


export class EnginePluginManager extends AbstractPluginManager
{


	public register(plugin: EnginePlugin)
	{
		super.register(plugin);
	}


	public onBeforeCompile(arg: OnBeforeCompileArgument): void
	{
		this.hook('onBeforeCompile', arg);
	}


	public onAfterCompile(arg: OnAfterCompileArgument): void
	{
		this.hook('onAfterCompile', arg);
	}


	public onBeforeProcessElement(element: _.ASTHTMLNodeElement, arg: OnBeforeProcessElementArgument): _.ASTHTMLNodeElement
	{
		return this.hook('onBeforeProcessElement', element, arg);
	}


	public onProcessElement(element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): void
	{
		this.hook('onProcessElement', element, arg);
	}


	public onAfterProcessElement(element: _.ASTHTMLNodeElement, arg: OnAfterProcessElementArgument): void
	{
		this.hook('onAfterProcessElement', element, arg);
	}


	public onProcessTemplate(arg: OnProcessTemplateArgument): void
	{
		this.hook('onProcessTemplate', arg);
	}


	public onExpressionVariableHook(identifier: tjs.ASTCallExpression, arg: OnExpressionVariableHookArgument): tjs.ASTExpression
	{
		return this.hook('onExpressionVariableHook', identifier, arg);
	}

}
