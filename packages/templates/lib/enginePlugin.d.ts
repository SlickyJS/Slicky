import { Matcher } from '@slicky/query-selector';
import * as _ from '@slicky/html-parser';
import * as tjs from '@slicky/tiny-js';
import { Engine } from './engine';
import { EngineProgress } from './engineProgress';
import * as t from './builder';
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
    element: t.TemplateNodeElement;
    progress: EngineProgress;
    matcher: Matcher;
    engine: Engine;
}
export interface OnProcessTemplateArgument {
    element: _.ASTHTMLNodeElement;
    template: t.TemplateMethodTemplate;
    comment: t.TemplateNodeComment;
    progress: EngineProgress;
    engine: Engine;
}
export declare abstract class EnginePlugin {
    onBeforeProcessElement(element: _.ASTHTMLNodeElement, arg: OnBeforeProcessElementArgument): _.ASTHTMLNodeElement;
    onProcessElement(element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): void;
    onProcessTemplate(arg: OnProcessTemplateArgument): void;
    onExpressionVariableHook(identifier: tjs.ASTCallExpression, arg: OnExpressionVariableHookArgument): tjs.ASTExpression;
}
