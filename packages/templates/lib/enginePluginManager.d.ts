import * as _ from '@slicky/html-parser';
import * as tjs from '@slicky/tiny-js';
import { EnginePlugin, OnBeforeProcessElementArgument, OnExpressionVariableHookArgument, OnProcessTemplateArgument, OnProcessElementArgument } from './enginePlugin';
export declare class EnginePluginManager {
    private plugins;
    register(plugin: EnginePlugin): void;
    onBeforeProcessElement(element: _.ASTHTMLNodeElement, arg: OnBeforeProcessElementArgument): _.ASTHTMLNodeElement;
    onProcessElement(element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): void;
    onProcessTemplate(arg: OnProcessTemplateArgument): void;
    onExpressionVariableHook(identifier: tjs.ASTCallExpression, arg: OnExpressionVariableHookArgument): tjs.ASTExpression;
    private hook(name, ...args);
}
