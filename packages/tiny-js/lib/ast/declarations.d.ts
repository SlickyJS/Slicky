import { ASTStatement } from './statements';
import { ASTExpression, ASTIdentifier } from './expressions';
export declare abstract class ASTDeclaration extends ASTStatement {
}
export declare class ASTVariableDeclaration extends ASTDeclaration {
    name: ASTIdentifier;
    init: ASTExpression;
    constructor(name: ASTIdentifier, init?: ASTExpression);
    render(): string;
}
