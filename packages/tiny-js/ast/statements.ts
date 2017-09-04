import {map, exists} from '@slicky/utils';
import {ASTNode} from './nodes';
import {ASTExpression} from './expressions';


export abstract class ASTStatement extends ASTNode
{
}


export class ASTBlockStatement extends ASTStatement
{


	public body: Array<ASTStatement>;


	constructor(body: Array<ASTStatement>)
	{
		super();

		this.body = body;
	}


	public render(): string
	{
		let statements = map(this.body, (statement: ASTStatement) => statement.render()).join('; ');

		return `(${statements})`;
	}

}


export class ASTReturnStatement extends ASTStatement
{

	public argument: ASTExpression;


	constructor(argument?: ASTExpression)
	{
		super();

		this.argument = argument;
	}


	public render(): string
	{
		let argument = exists(this.argument) ? ` ${this.argument.render()}` : '';

		return `return${argument}`;
	}

}


export class ASTVoidStatement extends ASTStatement
{

	public argument: ASTExpression;


	constructor(argument?: ASTExpression)
	{
		super();

		this.argument = argument;
	}


	public render(): string
	{
		let argument = exists(this.argument) ? ` ${this.argument.render()}` : '';

		return `void${argument}`;
	}

}


export class ASTThrowStatement extends ASTStatement
{


	public argument: ASTExpression;


	constructor(argument: ASTExpression)
	{
		super();

		this.argument = argument;
	}


	public render(): string
	{
		return `throw ${this.argument.render()}`;
	}

}


export class ASTDebuggerStatement extends ASTStatement
{


	public render(): string
	{
		return 'debugger';
	}

}
