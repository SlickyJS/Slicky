import { ASTNode } from './nodes';
import { ASTStatement } from './statements';
export declare class ASTProgram extends ASTNode {
    body: Array<ASTStatement>;
    constructor(body: Array<ASTStatement>);
    render(): string;
}
