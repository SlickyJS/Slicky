import { AbstractTokenizer, InputStream } from '@slicky/tokenizer';
export declare enum TokenType {
    String = 0,
    Number = 1,
    Keyword = 2,
    Name = 3,
    Operator = 4,
    Punctuation = 5,
}
export interface Token {
    type: TokenType;
    value: string;
}
export declare class Tokenizer extends AbstractTokenizer<Token> {
    static createFromString(input: string): Tokenizer;
    isToken(token: Token, type: TokenType, ...value: Array<string>): boolean;
    isCurrentToken(type: TokenType, ...value: Array<string>): boolean;
    isNextToken(type: TokenType, ...value: Array<string>): boolean;
    isPeek(type: TokenType, ...value: Array<string>): boolean;
    matchToken(type: TokenType, ...value: Array<string>): Token;
    protected doReadInput(input: InputStream): Token;
}
