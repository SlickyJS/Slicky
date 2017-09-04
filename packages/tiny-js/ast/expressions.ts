import {map} from '@slicky/utils';
import {ASTNode} from './nodes';
import {ASTStatement, ASTReturnStatement} from './statements';


export abstract class ASTExpression extends ASTNode
{
}


export class ASTIdentifier extends ASTExpression
{


	public name: string;


	constructor(name: string)
	{
		super();

		this.name = name;
	}


	public render(): string
	{
		return this.name;
	}

}


export class ASTArrowFunctionExpression extends ASTExpression
{


	public arguments: Array<ASTIdentifier>;

	public body: Array<ASTStatement>|ASTReturnStatement;


	constructor(args: Array<ASTIdentifier>, body: Array<ASTStatement>|ASTReturnStatement)
	{
		super();

		this.arguments = args;
		this.body = body;
	}


	public render(): string
	{
		let args = map(this.arguments, (argument: ASTIdentifier) => argument.render()).join(', ');
		let body = this.body instanceof ASTReturnStatement ? this.body.render() : map(this.body, (statement: ASTStatement) => statement.render()).join('; ');

		return `function(${args}) {${body}}`;
	}

}


export class ASTArrayExpression extends ASTExpression
{


	public elements: Array<ASTExpression|null>;


	constructor(elements: Array<ASTExpression|null>)
	{
		super();

		this.elements = elements;
	}


	public render(): string
	{
		let elements = map(this.elements, (element: ASTExpression) => element.render()).join(', ');

		return `[${elements}]`;
	}

}


export class ASTObjectExpression extends ASTExpression
{


	public members: Array<ASTObjectMember>;


	constructor(members: Array<ASTObjectMember>)
	{
		super();

		this.members = members;
	}


	public render(): string
	{
		let members = map(this.members, (member: ASTObjectMember) => member.render()).join(', ');

		return `{${members}}`;
	}

}


export class ASTObjectMember extends ASTNode
{


	public key: ASTExpression;

	public value: ASTExpression;


	constructor(key: ASTExpression, value: ASTExpression)
	{
		super();

		this.key = key;
		this.value = value;
	}


	public render(): string
	{
		return `${this.key.render()}: ${this.value.render()}`;
	}

}


export class ASTUnaryExpression extends ASTExpression
{


	public operator: string;

	public argument: ASTExpression;


	constructor(operator: string, argument: ASTExpression)
	{
		super();

		this.operator = operator;
		this.argument = argument;
	}


	public render(): string
	{
		return `${this.operator}${this.argument.render()}`;
	}

}


export class ASTUpdateExpression extends ASTExpression
{


	public operator: string;

	public argument: ASTExpression;


	constructor(operator: string, argument: ASTExpression)
	{
		super();

		this.operator = operator;
		this.argument = argument;
	}


	public render(): string
	{
		return `${this.argument.render()}${this.operator}`;
	}

}


export class ASTBinaryExpression extends ASTExpression
{


	public operator: string;

	public left: ASTExpression;

	public right: ASTExpression;


	constructor(operator: string, left: ASTExpression, right: ASTExpression)
	{
		super();

		this.operator = operator;
		this.left = left;
		this.right = right;
	}


	public render(): string
	{
		return `${this.left.render()} ${this.operator} ${this.right.render()}`;
	}

}


export class ASTAssignmentExpression extends ASTExpression
{


	public operator: string;

	public left: ASTExpression;

	public right: ASTExpression;


	constructor(operator: string, left: ASTExpression, right: ASTExpression)
	{
		super();

		this.operator = operator;
		this.left = left;
		this.right = right;
	}


	public render(): string
	{
		return `${this.left.render()} ${this.operator} ${this.right.render()}`;
	}

}


export class ASTLogicalExpression extends ASTExpression
{


	public operator: string;

	public left: ASTExpression;

	public right: ASTExpression;


	constructor(operator: string, left: ASTExpression, right: ASTExpression)
	{
		super();

		this.operator = operator;
		this.left = left;
		this.right = right;
	}


	public render(): string
	{
		return `${this.left.render()} ${this.operator} ${this.right.render()}`;
	}

}


export class ASTMemberExpression extends ASTExpression
{


	public object: ASTExpression;

	public property: ASTExpression;


	constructor(object: ASTExpression, property: ASTExpression)
	{
		super();

		this.object = object;
		this.property = property;
	}


	public render(): string
	{
		let property = this.property instanceof ASTIdentifier ? `.${this.property.render()}` : this.property.render();

		return `${this.object.render()}${property}`;
	}

}


export class ASTConditionalExpression extends ASTExpression
{


	public test: ASTExpression;

	public alternate: ASTExpression;

	public consequent: ASTExpression;


	constructor(test: ASTExpression, alternate: ASTExpression, consequent: ASTExpression)
	{
		super();

		this.test = test;
		this.alternate = alternate;
		this.consequent = consequent;
	}


	public render(): string
	{
		return `${this.test.render()} ? ${this.alternate.render()} : ${this.consequent.render()}`;
	}

}


export class ASTCallExpression extends ASTExpression
{


	public callee: ASTExpression;

	public arguments: Array<ASTExpression>;


	constructor(callee: ASTExpression, args: Array<ASTExpression>)
	{
		super();

		this.callee = callee;
		this.arguments = args;
	}


	public render(): string
	{
		let args = map(this.arguments, (argument: ASTExpression) => argument.render()).join(', ');

		return `${this.callee.render()}(${args})`;
	}

}


export class ASTNewExpression extends ASTCallExpression
{


	public render(): string
	{
		return `new ${super.render()}`;
	}

}


export class ASTFilterExpression extends ASTExpression
{


	public name: ASTIdentifier;

	public modify: ASTExpression;

	public arguments: Array<ASTExpression>;


	constructor(name: ASTIdentifier, modify: ASTExpression, args: Array<ASTExpression>)
	{
		super();

		this.name = name;
		this.modify = modify;
		this.arguments = args;
	}


	public render(): string
	{
		let args = this.arguments.length ? `, ${map(this.arguments, (argument: ASTExpression) => argument.render()).join(', ')}` : '';

		return `${this.name.render()}(${this.modify.render()}${args})`;
	}

}
