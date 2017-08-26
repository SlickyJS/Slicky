import { ASTNode } from './nodes';
import { ASTExpression } from './expressions';
export declare abstract class ASTStatement extends ASTNode {
}
export declare class ASTBlockStatement extends ASTStatement {
    body: Array<ASTStatement>;
    constructor(body: Array<ASTStatement>);
    render(): string;
}
export declare class ASTReturnStatement extends ASTStatement {
    argument: ASTExpression;
    constructor(argument?: ASTExpression);
    render(): string;
}
export declare class ASTVoidStatement extends ASTStatement {
    argument: ASTExpression;
    constructor(argument?: ASTExpression);
    render(): string;
}
export declare class ASTThrowStatement extends ASTStatement {
    argument: ASTExpression;
    constructor(argument: ASTExpression);
    render(): string;
}
export declare class ASTDebuggerStatement extends ASTStatement {
    render(): string;
}
