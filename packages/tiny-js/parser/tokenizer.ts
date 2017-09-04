import {AbstractTokenizer, InputStream} from '@slicky/tokenizer';
import {KEYWORDS, OPERATORS, PUNCTUATIONS} from './data';


export enum TokenType
{
	String,
	Number,
	Keyword,
	Name,
	Operator,
	Punctuation,
}


export declare interface Token
{
	type: TokenType,
	value: string,
}


export class Tokenizer extends AbstractTokenizer<Token>
{


	public static createFromString(input: string): Tokenizer
	{
		return new Tokenizer(new InputStream(input));
	}


	public isToken(token: Token, type: TokenType, ...value: Array<string>): boolean
	{
		if (!token || token.type !== type) {
			return false;
		}

		if (!value.length) {
			return true;
		}

		return value.indexOf(token.value) >= 0;
	}


	public isCurrentToken(type: TokenType, ...value: Array<string>): boolean
	{
		return this.isToken(this.current(), type, ...value);
	}


	public isNextToken(type: TokenType, ...value: Array<string>): boolean
	{
		return this.isToken(this.lookahead(), type, ...value);
	}


	public isPeek(type: TokenType, ...value: Array<string>): boolean
	{
		return this.isToken(this.peek(), type, ...value);
	}


	public matchToken(type: TokenType, ...value: Array<string>): Token
	{
		if (!this.isCurrentToken(type, ...value)) {
			this.expected(TokenType[type] + (value.length ? ` (${value.join('|')})` : ''));
		}

		return this.next();
	}


	protected doReadInput(input: InputStream): Token
	{
		input.readWhile(isWhitespace);

		let current = input.current();

		if (input.isSequenceFollowing(...KEYWORDS)) {
			return {
				type: TokenType.Keyword,
				value: input.matchSequence(...KEYWORDS),
			};
		}

		if (input.isSequenceFollowing(...PUNCTUATIONS)) {
			return {
				type: TokenType.Punctuation,
				value: input.matchSequence(...PUNCTUATIONS),
			};
		}

		if (input.isSequenceFollowing(...OPERATORS)) {
			return {
				type: TokenType.Operator,
				value: input.matchSequence(...OPERATORS),
			};
		}

		if (isStringStart(current)) {
			return {
				type: TokenType.String,
				value: readString(input),
			};
		}

		if (isDigit(current)) {
			return {
				type: TokenType.Number,
				value: readNumber(input),
			};
		}

		if (isIdentifierStart(current)) {
			return {
				type: TokenType.Name,
				value: readIdentifier(input),
			};
		}
	}

}


function isStringStart(ch: string): boolean
{
	return ch === '"' || ch === "'";
}


function isDigit(ch: string): boolean
{
	return /[0-9]/i.test(ch);
}


function isWhitespace(ch: string): boolean
{
	return ch === ' ';
}


function isIdentifierStart(ch: string): boolean
{
	return /[a-z_$]/i.test(ch);
}


function isIdentifier(ch: string): boolean
{
	return isIdentifierStart(ch) || isDigit(ch);
}


function readString(input: InputStream): string
{
	return readEscaped(input, input.current());
}


function readIdentifier(input: InputStream): string
{
	return input.readWhile((ch) => isIdentifier(ch));
}


function readNumber(input: InputStream): string
{
	let hasDot = false;

	return input.readWhile((ch: string) => {
		if (ch === '.') {
			if (hasDot) {
				return false;
			}

			hasDot = true;
			return true;
		}

		return isDigit(ch);
	});
}


function readEscaped(input: InputStream, end: string): string
{
	let escaped = false;
	let str = '';

	input.next();

	while (!input.eof()) {
		let ch = input.next();

		if (escaped) {
			str += ch;
			escaped = false;

		} else if (ch === '\\') {
			escaped = true;

		} else if (ch === end) {
			break;

		} else {
			str += ch;
		}
	}

	return str;
}
