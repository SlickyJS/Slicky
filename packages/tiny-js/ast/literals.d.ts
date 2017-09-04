import { ASTExpression } from './expressions';
export declare abstract class ASTLiteral extends ASTExpression {
}
export declare class ASTRegExpLiteral extends ASTLiteral {
    pattern: string;
    flags: string;
    constructor(pattern: string, flags: string);
    render(): string;
}
export declare class ASTNullLiteral extends ASTLiteral {
    render(): string;
}
export declare class ASTStringLiteral extends ASTLiteral {
    value: string;
    constructor(value: string);
    render(): string;
}
export declare class ASTBooleanLiteral extends ASTLiteral {
    value: boolean;
    constructor(value: boolean);
    render(): string;
}
export declare class ASTNumericLiteral extends ASTLiteral {
    value: number;
    constructor(value: number);
    render(): string;
}
