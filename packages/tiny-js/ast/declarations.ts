import {exists} from '@slicky/utils';
import {ASTStatement} from './statements';
import {ASTExpression, ASTIdentifier} from './expressions'


export abstract class ASTDeclaration extends ASTStatement
{
}


export class ASTVariableDeclaration extends ASTDeclaration
{


	public name: ASTIdentifier;

	public init: ASTExpression;


	constructor(name: ASTIdentifier, init?: ASTExpression)
	{
		super();

		this.name = name;
		this.init = init;
	}


	public render(): string
	{
		let init = exists(this.init) ? ` = ${this.init.render()}` : '';

		return `var ${this.name.render()}${init}`;
	}

}
