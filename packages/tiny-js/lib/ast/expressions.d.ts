import { ASTNode } from './nodes';
import { ASTStatement, ASTReturnStatement } from './statements';
export declare abstract class ASTExpression extends ASTNode {
}
export declare class ASTIdentifier extends ASTExpression {
    name: string;
    constructor(name: string);
    render(): string;
}
export declare class ASTArrowFunctionExpression extends ASTExpression {
    arguments: Array<ASTIdentifier>;
    body: Array<ASTStatement> | ASTReturnStatement;
    constructor(args: Array<ASTIdentifier>, body: Array<ASTStatement> | ASTReturnStatement);
    render(): string;
}
export declare class ASTArrayExpression extends ASTExpression {
    elements: Array<ASTExpression | null>;
    constructor(elements: Array<ASTExpression | null>);
    render(): string;
}
export declare class ASTObjectExpression extends ASTExpression {
    members: Array<ASTObjectMember>;
    constructor(members: Array<ASTObjectMember>);
    render(): string;
}
export declare class ASTObjectMember extends ASTNode {
    key: ASTExpression;
    value: ASTExpression;
    constructor(key: ASTExpression, value: ASTExpression);
    render(): string;
}
export declare class ASTUnaryExpression extends ASTExpression {
    operator: string;
    argument: ASTExpression;
    constructor(operator: string, argument: ASTExpression);
    render(): string;
}
export declare class ASTUpdateExpression extends ASTExpression {
    operator: string;
    argument: ASTExpression;
    constructor(operator: string, argument: ASTExpression);
    render(): string;
}
export declare class ASTBinaryExpression extends ASTExpression {
    operator: string;
    left: ASTExpression;
    right: ASTExpression;
    constructor(operator: string, left: ASTExpression, right: ASTExpression);
    render(): string;
}
export declare class ASTAssignmentExpression extends ASTExpression {
    operator: string;
    left: ASTExpression;
    right: ASTExpression;
    constructor(operator: string, left: ASTExpression, right: ASTExpression);
    render(): string;
}
export declare class ASTLogicalExpression extends ASTExpression {
    operator: string;
    left: ASTExpression;
    right: ASTExpression;
    constructor(operator: string, left: ASTExpression, right: ASTExpression);
    render(): string;
}
export declare class ASTMemberExpression extends ASTExpression {
    object: ASTExpression;
    property: ASTExpression;
    constructor(object: ASTExpression, property: ASTExpression);
    render(): string;
}
export declare class ASTConditionalExpression extends ASTExpression {
    test: ASTExpression;
    alternate: ASTExpression;
    consequent: ASTExpression;
    constructor(test: ASTExpression, alternate: ASTExpression, consequent: ASTExpression);
    render(): string;
}
export declare class ASTCallExpression extends ASTExpression {
    callee: ASTExpression;
    arguments: Array<ASTExpression>;
    constructor(callee: ASTExpression, args: Array<ASTExpression>);
    render(): string;
}
export declare class ASTNewExpression extends ASTCallExpression {
    render(): string;
}
export declare class ASTFilterExpression extends ASTExpression {
    name: ASTIdentifier;
    modify: ASTExpression;
    arguments: Array<ASTExpression>;
    constructor(name: ASTIdentifier, modify: ASTExpression, args: Array<ASTExpression>);
    render(): string;
}
