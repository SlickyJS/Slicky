import { InputStream, AbstractTokenizer } from '@slicky/tokenizer';
export interface TextTokenizerOptions {
    expressionOpeningTag?: string;
    expressionClosingTag?: string;
}
export declare abstract class TextToken {
    value: string;
    constructor(value: string);
}
export declare class TextTokenText extends TextToken {
}
export declare class TextTokenExpression extends TextToken {
}
export declare class TextTokenizer extends AbstractTokenizer<TextToken> {
    static DEFAULT_EXPRESSION_OPENING_TAG: string;
    static DEFAULT_EXPRESSION_CLOSING_TAG: string;
    private expressionOpeningTag;
    private expressionClosingTag;
    constructor(input: InputStream, options?: TextTokenizerOptions);
    protected doReadInput(input: InputStream): TextToken;
}
