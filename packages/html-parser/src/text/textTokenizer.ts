import {exists} from '@slicky/utils';
import {InputStream, AbstractTokenizer} from '@slicky/tokenizer';


export declare interface TextTokenizerOptions
{
	expressionOpeningTag?: string,
	expressionClosingTag?: string,
}


export abstract class TextToken
{


	public value: string;


	constructor(value: string)
	{
		this.value = value;
	}

}


export class TextTokenText extends TextToken
{
}


export class TextTokenExpression extends TextToken
{
}


export class TextTokenizer extends AbstractTokenizer<TextToken>
{


	public static DEFAULT_EXPRESSION_OPENING_TAG = '{{';
	public static DEFAULT_EXPRESSION_CLOSING_TAG = '}}';


	private expressionOpeningTag = TextTokenizer.DEFAULT_EXPRESSION_OPENING_TAG;

	private expressionClosingTag = TextTokenizer.DEFAULT_EXPRESSION_CLOSING_TAG;


	constructor(input: InputStream, options: TextTokenizerOptions = {})
	{
		super(input);

		if (exists(options.expressionOpeningTag)) {
			this.expressionOpeningTag = options.expressionOpeningTag;
		}

		if (exists(options.expressionClosingTag)) {
			this.expressionClosingTag = options.expressionClosingTag;
		}
	}


	protected doReadInput(input: InputStream): TextToken
	{
		if (input.isSequenceFollowing(this.expressionOpeningTag)) {
			input.matchSequence(this.expressionOpeningTag);
			let expression = input.readWhile(() => !input.isSequenceFollowing(this.expressionClosingTag));
			input.matchSequence(this.expressionClosingTag);

			return new TextTokenExpression(expression.trim());
		}

		return new TextTokenText(
			input.readWhile(() => !input.isSequenceFollowing(this.expressionOpeningTag))
		);
	}

}
