import {ASTExpression} from './expressions';


export abstract class ASTLiteral extends ASTExpression
{
}


export class ASTRegExpLiteral extends ASTLiteral
{


	public pattern: string;

	public flags: string;


	constructor(pattern: string, flags: string)
	{
		super();

		this.pattern = pattern;
		this.flags = flags;
	}


	public render(): string
	{
		return `/${this.pattern}/${this.flags}`;
	}

}


export class ASTNullLiteral extends ASTLiteral
{


	public render(): string
	{
		return 'null';
	}

}


export class ASTStringLiteral extends ASTLiteral
{


	public value: string;


	constructor(value: string)
	{
		super();

		this.value = value;
	}


	public render(): string
	{
		return `'${this.value}'`;
	}

}


export class ASTBooleanLiteral extends ASTLiteral
{


	public value: boolean;


	constructor(value: boolean)
	{
		super();

		this.value = value;
	}


	public render(): string
	{
		return this.value === true ? 'true' : 'false';
	}

}


export class ASTNumericLiteral extends ASTLiteral
{


	public value: number;


	constructor(value: number)
	{
		super();

		this.value = value;
	}


	public render(): string
	{
		return this.value + '';
	}

}
