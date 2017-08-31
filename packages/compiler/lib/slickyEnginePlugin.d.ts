import * as c from '@slicky/core';
import * as _ from '@slicky/html-parser';
import * as tjs from '@slicky/tiny-js';
import * as t from '@slicky/templates';
import { Compiler } from './compiler';
export declare class SlickyEnginePlugin extends t.EnginePlugin {
    private compiler;
    private metadata;
    private expressionInParent;
    constructor(compiler: Compiler, metadata: c.DirectiveDefinition);
    onProcessElement(element: _.ASTHTMLNodeElement, arg: t.OnProcessElementArgument): _.ASTHTMLNodeElement;
    onExpressionVariableHook(identifier: tjs.ASTCallExpression, arg: t.OnExpressionVariableHookArgument): tjs.ASTExpression;
}
