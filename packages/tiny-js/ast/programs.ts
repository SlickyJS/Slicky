import {map} from '@slicky/utils';
import {ASTNode} from './nodes';
import {ASTStatement} from './statements';


export class ASTProgram extends ASTNode
{


	public body: Array<ASTStatement>;


	constructor(body: Array<ASTStatement>)
	{
		super();

		this.body = body;
	}


	public render(): string
	{
		return map(this.body, (statement: ASTStatement) => statement.render()).join('; ');
	}

}
