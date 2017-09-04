import { Matcher } from '@slicky/query-selector';
import * as _ from '@slicky/html-parser';
import * as tjs from '@slicky/tiny-js';
import { Engine } from './';
import { EngineProgress } from './engineProgress';
import * as b from '../builder';
export interface OnBeforeProcessElementArgument {
    progress: EngineProgress;
    engine: Engine;
    matcher: Matcher;
}
export interface OnExpressionVariableHookArgument {
    declaration: tjs.ParserVariableDeclaration;
    progress: EngineProgress;
    engine: Engine;
}
export interface OnProcessElementArgument {
    element: b.BuilderAddElement;
    progress: EngineProgress;
    matcher: Matcher;
    engine: Engine;
}
export interface OnProcessTemplateArgument {
    element: _.ASTHTMLNodeElement;
    template: b.BuilderTemplateMethod;
    comment: b.BuilderAddComment;
    progress: EngineProgress;
    engine: Engine;
}
export declare abstract class EnginePlugin {
    onBeforeProcessElement(element: _.ASTHTMLNodeElement, arg: OnBeforeProcessElementArgument): _.ASTHTMLNodeElement;
    onProcessElement(element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): void;
    onProcessTemplate(arg: OnProcessTemplateArgument): void;
    onExpressionVariableHook(identifier: tjs.ASTCallExpression, arg: OnExpressionVariableHookArgument): tjs.ASTExpression;
}
