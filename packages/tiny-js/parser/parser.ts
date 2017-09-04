import {InputStream} from '@slicky/tokenizer';
import {exists, clone} from '@slicky/utils';
import {Tokenizer, TokenType, Token} from './tokenizer';
import {ASSIGNMENT_OPERATORS, UPDATE_OPERATORS, BINARY_OPERATORS, LOGICAL_OPERATORS, UNARY_OPERATORS} from './data';
import * as _ from '../ast';


export enum ParserVariableDeclaration
{
	Global,
	Local,
	FunctionArgument,
}


export declare interface ParserVariableHook
{
	(identifier: _.ASTIdentifier, declaration: ParserVariableDeclaration): _.ASTExpression|void,
}


export declare interface ParserVariableDeclarationHook
{
	(identifier: _.ASTVariableDeclaration): _.ASTExpression|void,
}


export declare interface ParserFilterExpressionHook
{
	(filter: _.ASTFilterExpression): _.ASTExpression|void,
}


export declare interface ParserOptions
{
	addMissingReturn?: boolean,
	variableHook?: ParserVariableHook,
	variableDeclarationHook?: ParserVariableDeclarationHook,
	filterExpressionHook?: ParserFilterExpressionHook,
}


export class Parser
{


	private input: Tokenizer;

	private progress: ParserScopeProgress;

	private addMissingReturn: boolean;

	private variableHook: ParserVariableHook;

	private variableDeclarationHook: ParserVariableDeclarationHook;

	private filterExpressionHook: ParserFilterExpressionHook;


	constructor(input: Tokenizer, options: ParserOptions = {})
	{
		this.input = input;
		this.addMissingReturn = exists(options.addMissingReturn) ? options.addMissingReturn : false;
		this.variableHook = exists(options.variableHook) ? options.variableHook : (identifier: _.ASTIdentifier) => identifier;
		this.variableDeclarationHook = exists(options.variableDeclarationHook) ? options.variableDeclarationHook : (identifier: _.ASTVariableDeclaration) => identifier;
		this.filterExpressionHook = exists(options.filterExpressionHook) ? options.filterExpressionHook : (filter: _.ASTFilterExpression) => filter;

		this.progress = new ParserScopeProgress;
	}


	public static createFromString(input: string, options: ParserOptions = {}): Parser
	{
		return new Parser(new Tokenizer(new InputStream(input)), options);
	}


	public parse(): _.ASTProgram
	{
		let statements = [];

		while (!this.input.eof()) {
			statements.push(this.matchTopLevelStatement(this.progress));

			if (!this.input.eof()) {
				if (!this.input.isCurrentToken(TokenType.Punctuation, ';')) {
					this.input.unexpected(TokenType[this.input.current().type], this.input.current().value);
				}

				this.input.matchToken(TokenType.Punctuation, ';');
			}
		}

		this.addMissingReturnStatement(this.progress, statements);

		return new _.ASTProgram(statements);
	}


	private callVariableHook(progress: ParserScopeProgress, variable: _.ASTIdentifier): _.ASTExpression
	{
		let updated = this.variableHook(variable, progress.getVariableDeclaration(variable.name));

		return exists(updated) ? <_.ASTExpression>updated : variable;
	}


	private callVariableDeclarationHook(variable: _.ASTVariableDeclaration): _.ASTExpression
	{
		let updated = this.variableDeclarationHook(variable);

		return exists(updated) ? <_.ASTExpression>updated : variable;
	}


	private callFilterExpressionHook(filter: _.ASTFilterExpression): _.ASTExpression
	{
		let updated = this.filterExpressionHook(filter);

		return exists(updated) ? <_.ASTExpression>updated : filter;
	}


	private matchTopLevelStatement(progress: ParserScopeProgress): _.ASTStatement
	{
		if (this.input.isCurrentToken(TokenType.Keyword, 'let')) {
			return this.callVariableDeclarationHook(
				this.matchVariableDeclaration(progress)
			);
		}

		return this.matchExpression(progress, true);
	}


	private matchSimpleExpression(progress: ParserScopeProgress, identifierIsVariable: boolean): _.ASTExpression
	{
		if (isArrayFunctionExpression(this.input)) {
			return this.matchArrowFunctionExpression(progress);
		}

		if (this.input.isCurrentToken(TokenType.Keyword, 'true', 'false')) {
			return this.matchBooleanLiteral();
		}

		if (this.input.isCurrentToken(TokenType.Keyword, 'return')) {
			return this.matchReturnStatement(progress);
		}

		if (this.input.isCurrentToken(TokenType.Keyword, 'void')) {
			return this.matchVoidStatement(progress);
		}

		if (this.input.isCurrentToken(TokenType.Keyword, 'new')) {
			return this.matchNewExpression(progress);
		}

		if (this.input.isCurrentToken(TokenType.Keyword, 'null')) {
			return this.matchNullLiteral();
		}

		if (this.input.isCurrentToken(TokenType.Keyword, 'debugger')) {
			return this.matchDebuggerStatement();
		}

		if (this.input.isCurrentToken(TokenType.Keyword, 'throw')) {
			return this.matchThrowStatement(progress);
		}

		if (this.input.isCurrentToken(TokenType.String)) {
			return this.matchStringLiteral();
		}

		if (this.input.isCurrentToken(TokenType.Number)) {
			return this.matchNumericLiteral();
		}

		if (this.input.isCurrentToken(TokenType.Name)) {
			let identifier = this.matchIdentifier();
			return identifierIsVariable ? this.callVariableHook(progress, identifier) : identifier;
		}

		if (this.input.isCurrentToken(TokenType.Operator, '/')) {
			return this.matchRegExpLiteral();
		}

		if (this.input.isCurrentToken(TokenType.Operator, ...UNARY_OPERATORS)) {
			return this.matchUnaryExpression(progress);
		}

		if (this.input.isCurrentToken(TokenType.Punctuation, '[')) {
			return this.matchArrayExpression(progress);
		}

		if (this.input.isCurrentToken(TokenType.Punctuation, '{')) {
			return this.matchObjectExpression(progress);
		}

		if (this.input.isCurrentToken(TokenType.Punctuation, '(')) {
			return this.matchBlockStatement(progress);
		}
	}


	private matchExpression(progress: ParserScopeProgress, allowFilters: boolean = false, stopOnFilter: boolean = false, stopOnParenthesis: boolean = false, identifierIsVariable: boolean = true): _.ASTExpression
	{
		return this.matchPostExpression(
			progress,
			this.matchSimpleExpression(progress, identifierIsVariable),
			allowFilters,
			stopOnFilter,
			stopOnParenthesis
		);
	}


	private matchPostExpression(progress: ParserScopeProgress, expression: _.ASTExpression, allowFilters: boolean = false, stopOnFilter: boolean = false, stopOnParenthesis: boolean = false): _.ASTExpression
	{
		let updated: _.ASTExpression;

		if (stopOnFilter && this.input.isCurrentToken(TokenType.Operator, '|') && this.input.isNextToken(TokenType.Name)) {
			return expression;
		}

		if (stopOnParenthesis && this.input.isCurrentToken(TokenType.Punctuation, '(')) {
			return expression;
		}

		if (allowFilters && this.input.isCurrentToken(TokenType.Operator, '|') && this.input.isNextToken(TokenType.Name)) {
			updated = this.callFilterExpressionHook(
				this.matchFilterExpression(progress, expression)
			);

		} else if (this.input.isCurrentToken(TokenType.Operator, ...ASSIGNMENT_OPERATORS)) {
			updated = this.matchAssignmentExpression(progress, expression);

		} else if (this.input.isCurrentToken(TokenType.Operator, ...UPDATE_OPERATORS)) {
			updated = this.matchUpdateExpression(expression);

		} else if (this.input.isCurrentToken(TokenType.Operator, ...BINARY_OPERATORS)) {
			updated = this.matchBinaryExpression(progress, expression);

		} else if (this.input.isCurrentToken(TokenType.Operator, ...LOGICAL_OPERATORS)) {
			updated = this.matchLogicalExpression(progress, expression);

		} else if (this.input.isCurrentToken(TokenType.Operator, '?')) {
			updated = this.matchConditionalExpression(progress, expression);

		} else if (this.input.isCurrentToken(TokenType.Punctuation, '(')) {
			updated = this.matchCallExpression(progress, expression);

		} else if (this.input.isCurrentToken(TokenType.Punctuation, '.') || (this.input.isCurrentToken(TokenType.Punctuation, '['))) {
			updated = this.matchMemberExpression(progress, expression);

		}

		if (updated) {
			return this.matchPostExpression(progress, updated, allowFilters);
		}

		return expression;
	}


	protected matchDelimited<T extends _.ASTNode>(start: string, stop: string, separator: string, parser: () => T): Array<T>
	{
		let a = [];
		let first = true;

		this.input.matchToken(TokenType.Punctuation, start);

		while (!this.input.eof()) {
			if (this.input.isCurrentToken(TokenType.Punctuation, stop)) {
				break;
			}

			if (first) {
				first = false;
			} else {
				this.input.matchToken(TokenType.Punctuation, separator);
			}

			if (this.input.isCurrentToken(TokenType.Punctuation, stop)) {
				break;
			}

			a.push(parser());
		}

		this.input.matchToken(TokenType.Punctuation, stop);

		return a;
	}


	private matchVariableDeclaration(progress: ParserScopeProgress): _.ASTVariableDeclaration
	{
		this.input.matchToken(TokenType.Keyword, 'let');

		let name = this.matchIdentifier();
		let init;

		if (this.input.isCurrentToken(TokenType.Operator, '=')) {
			this.input.matchToken(TokenType.Operator, '=');
			init = this.matchExpression(progress);
		}

		progress.addVariable(name.name, ParserVariableDeclaration.Local);

		return new _.ASTVariableDeclaration(name, init);
	}


	private matchBooleanLiteral(): _.ASTBooleanLiteral
	{
		let value = this.input.matchToken(TokenType.Keyword, 'true', 'false').value;

		return new _.ASTBooleanLiteral(value === 'true');
	}


	private matchStringLiteral(): _.ASTStringLiteral
	{
		return new _.ASTStringLiteral(this.input.matchToken(TokenType.String).value);
	}


	private matchNumericLiteral(): _.ASTNumericLiteral
	{
		return new _.ASTNumericLiteral(parseFloat(this.input.matchToken(TokenType.Number).value));
	}


	private matchNullLiteral(): _.ASTNullLiteral
	{
		this.input.matchToken(TokenType.Keyword, 'null');

		return new _.ASTNullLiteral;
	}


	private matchRegExpLiteral(): _.ASTRegExpLiteral
	{
		this.input.matchToken(TokenType.Operator, '/');

		let pattern = '';
		let flags = '';

		while (!this.input.eof()) {
			if (this.input.current().value === '/') {
				break;
			}

			pattern += this.input.next().value;
		}

		this.input.matchToken(TokenType.Operator, '/');

		if (this.input.isCurrentToken(TokenType.Name)) {
			flags = this.input.matchToken(TokenType.Name).value;
		}

		return new _.ASTRegExpLiteral(
			pattern,
			flags
		);
	}


	private matchIdentifier(): _.ASTIdentifier
	{
		return new _.ASTIdentifier(this.input.matchToken(TokenType.Name).value);
	}


	private matchCallExpression(progress: ParserScopeProgress, callee: _.ASTExpression): _.ASTCallExpression
	{
		return new _.ASTCallExpression(
			callee,
			this.matchDelimited('(', ')', ',', () => this.matchExpression(progress))
		);
	}


	private matchArrayExpression(progress: ParserScopeProgress): _.ASTArrayExpression
	{
		return new _.ASTArrayExpression(
			this.matchDelimited('[', ']', ',', () => this.matchExpression(progress))
		);
	}


	private matchObjectExpression(progress: ParserScopeProgress): _.ASTObjectExpression
	{
		return new _.ASTObjectExpression(
			this.matchDelimited('{', '}', ',', () => this.matchObjectMember(progress))
		);
	}


	private matchObjectMember(progress: ParserScopeProgress): _.ASTObjectMember
	{
		let key = this.matchExpression(progress, false, false, false, false);
		this.input.matchToken(TokenType.Operator, ':');
		let value = this.matchExpression(progress);

		return new _.ASTObjectMember(
			key,
			value
		);
	}


	private matchAssignmentExpression(progress: ParserScopeProgress, left: _.ASTExpression): _.ASTAssignmentExpression
	{
		return new _.ASTAssignmentExpression(
			this.input.matchToken(TokenType.Operator, ...ASSIGNMENT_OPERATORS).value,
			left,
			this.matchExpression(progress)
		);
	}


	private matchUpdateExpression(argument: _.ASTExpression): _.ASTUpdateExpression
	{
		return new _.ASTUpdateExpression(
			this.input.matchToken(TokenType.Operator, ...UPDATE_OPERATORS).value,
			argument
		);
	}


	private matchUnaryExpression(progress: ParserScopeProgress): _.ASTUnaryExpression
	{
		return new _.ASTUnaryExpression(
			this.input.matchToken(TokenType.Operator, ...UNARY_OPERATORS).value,
			this.matchExpression(progress)
		);
	}


	private matchBinaryExpression(progress: ParserScopeProgress, left: _.ASTExpression): _.ASTBinaryExpression
	{
		return new _.ASTBinaryExpression(
			this.input.matchToken(TokenType.Operator, ...BINARY_OPERATORS).value,
			left,
			this.matchExpression(progress)
		);
	}


	private matchLogicalExpression(progress: ParserScopeProgress, left: _.ASTExpression): _.ASTLogicalExpression
	{
		return new _.ASTLogicalExpression(
			this.input.matchToken(TokenType.Operator, ...LOGICAL_OPERATORS).value,
			left,
			this.matchExpression(progress)
		);
	}


	private matchMemberExpression(progress: ParserScopeProgress, object: _.ASTExpression): _.ASTMemberExpression
	{
		let property: _.ASTExpression;

		if (this.input.isCurrentToken(TokenType.Punctuation, '.')) {
			this.input.matchToken(TokenType.Punctuation, '.');
			property = this.matchIdentifier();

		} else if (this.input.isCurrentToken(TokenType.Punctuation, '[')) {
			property = this.matchArrayExpression(progress);
		}

		return new _.ASTMemberExpression(
			object,
			property
		);
	}


	private matchFilterExpression(progress: ParserScopeProgress, modify: _.ASTExpression): _.ASTFilterExpression
	{
		this.input.matchToken(TokenType.Operator, '|');

		let name = this.matchIdentifier();
		let args = [];

		if (this.input.isCurrentToken(TokenType.Operator, ':')) {
			let first = true;

			this.input.matchToken(TokenType.Operator, ':');

			while (!this.input.eof()) {
				if (this.input.isCurrentToken(TokenType.Operator, '|') || this.input.isCurrentToken(TokenType.Punctuation, ')')) {
					break;
				}

				if (first) {
					first = false;
				} else {
					this.input.matchToken(TokenType.Operator, ':');
				}

				if (this.input.isCurrentToken(TokenType.Operator, '|') || this.input.isCurrentToken(TokenType.Punctuation, ')')) {
					break;
				}

				args.push(this.matchExpression(progress, false, true));
			}
		}

		return new _.ASTFilterExpression(
			name,
			modify,
			args
		);
	}


	private matchBlockStatement(progress: ParserScopeProgress): _.ASTBlockStatement
	{
		return new _.ASTBlockStatement(
			this.matchDelimited('(', ')', ';', () => this.matchExpression(progress, true))
		)
	}


	private matchArrowFunctionExpression(progress: ParserScopeProgress): _.ASTArrowFunctionExpression
	{
		progress = progress.fork();

		let body: Array<_.ASTStatement>|_.ASTReturnStatement;
		let args = this.matchDelimited('(', ')', ',', () => {
			let argument = this.matchIdentifier();

			progress.addVariable(argument.name, ParserVariableDeclaration.FunctionArgument);

			return argument;
		});

		this.input.matchToken(TokenType.Punctuation, '=>');

		if (this.input.isCurrentToken(TokenType.Punctuation, '{')) {
			body = this.matchDelimited('{', '}', ';', () => this.matchTopLevelStatement(progress));
			this.addMissingReturnStatement(progress, body);

		} else {
			body = new _.ASTReturnStatement(
				this.matchExpression(progress)
			);
		}

		return new _.ASTArrowFunctionExpression(
			args,
			body,
		);
	}


	private matchReturnStatement(progress: ParserScopeProgress): _.ASTReturnStatement
	{
		this.input.matchToken(TokenType.Keyword, 'return');

		let argument: _.ASTExpression;

		if (!this.input.eof() && !this.input.isCurrentToken(TokenType.Punctuation, ';')) {
			argument = this.matchExpression(progress);
		}

		progress.hasReturn = true;

		return new _.ASTReturnStatement(argument);
	}


	private matchVoidStatement(progress: ParserScopeProgress): _.ASTVoidStatement
	{
		this.input.matchToken(TokenType.Keyword, 'void');

		let argument: _.ASTExpression;

		if (!this.input.eof() && !this.input.isCurrentToken(TokenType.Punctuation, ';')) {
			argument = this.matchExpression(progress);
		}

		return new _.ASTVoidStatement(argument);
	}


	private matchNewExpression(progress: ParserScopeProgress): _.ASTNewExpression
	{
		this.input.matchToken(TokenType.Keyword, 'new');

		let callee = this.matchExpression(progress, false, false, true);
		let args = [];

		if (this.input.isCurrentToken(TokenType.Punctuation, '(')) {
			args = this.matchDelimited('(', ')', ',', () => this.matchExpression(progress));
		}

		return new _.ASTNewExpression(
			callee,
			args
		);
	}


	private matchConditionalExpression(progress: ParserScopeProgress, test: _.ASTExpression): _.ASTConditionalExpression
	{
		this.input.matchToken(TokenType.Operator, '?');

		let alternate = this.matchExpression(progress);
		let consequent: _.ASTExpression;

		if (this.input.isCurrentToken(TokenType.Operator, ':')) {
			this.input.matchToken(TokenType.Operator, ':');
			consequent = this.matchExpression(progress);

		} else {
			consequent = new _.ASTUnaryExpression(
				'void',
				new _.ASTNumericLiteral(0)
			);
		}


		return new _.ASTConditionalExpression(
			test,
			alternate,
			consequent
		);
	}


	private matchDebuggerStatement(): _.ASTDebuggerStatement
	{
		this.input.matchToken(TokenType.Keyword, 'debugger');

		return new _.ASTDebuggerStatement;
	}


	private matchThrowStatement(progress: ParserScopeProgress): _.ASTThrowStatement
	{
		this.input.matchToken(TokenType.Keyword, 'throw');

		return new _.ASTThrowStatement(
			this.matchExpression(progress)
		);
	}


	private addMissingReturnStatement(progress: ParserScopeProgress, statements: Array<_.ASTStatement>): void
	{
		if (this.addMissingReturn && !progress.hasReturn) {
			for (let i = statements.length - 1; i >= 0; i--) {
				if (statements[i] instanceof _.ASTExpression || statements[i] instanceof _.ASTBlockStatement) {
					statements[i] = new _.ASTReturnStatement(statements[i]);
					break;
				}
			}
		}
	}

}


class ParserScopeProgress
{


	public hasReturn: boolean = false;

	protected variables: {[name: string]: ParserVariableDeclaration} = {};


	public fork(): ParserScopeProgress
	{
		let parser = new ParserScopeProgress;

		parser.variables = clone(this.variables);

		return parser;
	}


	public addVariable(name: string, declaration: ParserVariableDeclaration): void
	{
		if (!exists(this.variables[name])) {
			this.variables[name] = declaration;
		}
	}


	public getVariableDeclaration(name: string): ParserVariableDeclaration
	{
		if (exists(this.variables[name])) {
			return this.variables[name];
		}

		return ParserVariableDeclaration.Global;
	}

}


function isArrayFunctionExpression(input: Tokenizer): boolean
{
	if (!input.isCurrentToken(TokenType.Punctuation, '(')) {
		return false;
	}

	let no = () => {
		input.resetPeek();
		return false;
	};

	if (!input.isNextToken(TokenType.Punctuation, ')')) {
		let peek: Token;

		while (peek = input.peek()) {
			if (!input.isToken(peek, TokenType.Name)) {
				return no();
			}

			peek = input.peek();

			if (input.isToken(peek, TokenType.Punctuation, ')')) {
				break;
			}

			if (!input.isToken(peek, TokenType.Punctuation, ',')) {
				return no();
			}
		}

	} else if (!input.isPeek(TokenType.Punctuation, ')')) {
		return no();
	}

	if (!input.isPeek(TokenType.Punctuation, '=>')) {
		return no();
	}

	input.resetPeek();

	return true;
}
