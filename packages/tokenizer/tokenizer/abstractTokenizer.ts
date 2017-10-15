import {exists} from '@slicky/utils';
import {InputStream} from './inputStream';


export abstract class AbstractTokenizer<T>
{


	private input: InputStream;

	private position: number = 0;

	private peekPosition: number = 0;

	private tokens: Array<T> = [];


	constructor(input: InputStream)
	{
		this.input = input;
	}


	protected abstract doReadInput(input: InputStream): T;


	public error(message: string): void
	{
		this.input.error(message);
	}


	public expected(type: string, value?: string): void
	{
		this.input.expected(type, value);
	}


	public unexpected(type: string, value?: string): void
	{
		this.input.unexpected(type, value);
	}


	public tokenize(): Array<T>
	{
		let result = [];

		while (!this.eof()) {
			result.push(this.next());
		}

		return result;
	}


	public current(): T
	{
		return this.readToken(this.position);
	}


	public lookahead(): T
	{
		return this.readToken(this.position + 1);
	}


	public next(): T
	{
		return this.readToken(this.position++);
	}


	public peek(): T
	{
		return this.readToken(this.position + ++this.peekPosition);
	}


	public resetPeek(): void
	{
		this.peekPosition = 0;
	}


	public eof(): boolean
	{
		return !exists(this.current());
	}


	private readToken(position: number): T
	{
		if (exists(this.tokens[position])) {
			return this.tokens[position];
		}

		if (this.input.eof()) {
			return undefined;
		}

		this.tokens.push(this.doReadInput(this.input));

		return this.tokens[position];
	}

}
