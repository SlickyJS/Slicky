import { EnginePlugin, OnProcessElementArgument, OnExpressionVariableHookArgument } from '@slicky/templates';
import * as c from '@slicky/core';
import * as _ from '@slicky/html-parser';
import * as tjs from '@slicky/tiny-js';
import { Compiler } from './compiler';
export declare class SlickyEnginePlugin extends EnginePlugin {
    private compiler;
    private metadata;
    private expressionInParent;
    constructor(compiler: Compiler, metadata: c.DirectiveDefinition);
    onProcessElement(element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): _.ASTHTMLNodeElement;
    onExpressionVariableHook(identifier: tjs.ASTCallExpression, arg: OnExpressionVariableHookArgument): tjs.ASTExpression;
}
