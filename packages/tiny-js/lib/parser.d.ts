import { Tokenizer } from './tokenizer';
import * as _ from './ast';
export declare enum ParserVariableDeclaration {
    Global = 0,
    Local = 1,
    FunctionArgument = 2,
}
export interface ParserVariableHook {
    (identifier: _.ASTIdentifier, declaration: ParserVariableDeclaration): _.ASTExpression | void;
}
export interface ParserVariableDeclarationHook {
    (identifier: _.ASTVariableDeclaration): _.ASTExpression | void;
}
export interface ParserFilterExpressionHook {
    (filter: _.ASTFilterExpression): _.ASTExpression | void;
}
export interface ParserOptions {
    addMissingReturn?: boolean;
    variableHook?: ParserVariableHook;
    variableDeclarationHook?: ParserVariableDeclarationHook;
    filterExpressionHook?: ParserFilterExpressionHook;
}
export declare class Parser {
    private input;
    private progress;
    private addMissingReturn;
    private variableHook;
    private variableDeclarationHook;
    private filterExpressionHook;
    constructor(input: Tokenizer, options?: ParserOptions);
    static createFromString(input: string, options?: ParserOptions): Parser;
    parse(): _.ASTProgram;
    private callVariableHook(progress, variable);
    private callVariableDeclarationHook(variable);
    private callFilterExpressionHook(filter);
    private matchTopLevelStatement(progress);
    private matchSimpleExpression(progress, identifierIsVariable);
    private matchExpression(progress, allowFilters?, stopOnFilter?, stopOnParenthesis?, identifierIsVariable?);
    private matchPostExpression(progress, expression, allowFilters?, stopOnFilter?, stopOnParenthesis?);
    protected matchDelimited<T extends _.ASTNode>(start: string, stop: string, separator: string, parser: () => T): Array<T>;
    private matchVariableDeclaration(progress);
    private matchBooleanLiteral();
    private matchStringLiteral();
    private matchNumericLiteral();
    private matchNullLiteral();
    private matchRegExpLiteral();
    private matchIdentifier();
    private matchCallExpression(progress, callee);
    private matchArrayExpression(progress);
    private matchObjectExpression(progress);
    private matchObjectMember(progress);
    private matchAssignmentExpression(progress, left);
    private matchUpdateExpression(argument);
    private matchUnaryExpression(progress);
    private matchBinaryExpression(progress, left);
    private matchLogicalExpression(progress, left);
    private matchMemberExpression(progress, object);
    private matchFilterExpression(progress, modify);
    private matchBlockStatement(progress);
    private matchArrowFunctionExpression(progress);
    private matchReturnStatement(progress);
    private matchVoidStatement(progress);
    private matchNewExpression(progress);
    private matchConditionalExpression(progress, test);
    private matchDebuggerStatement();
    private matchThrowStatement(progress);
    private addMissingReturnStatement(progress, statements);
}
