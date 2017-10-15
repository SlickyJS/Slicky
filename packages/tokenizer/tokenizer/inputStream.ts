import {exists} from '@slicky/utils';


export class InputStream
{


	private input: string;

	private position: number = 0;

	private peekPosition: number = 0;


	constructor(input: string)
	{
		this.input = input;
	}


	public error(message: string): void
	{
		throw new Error(`${message} (pos: ${this.position})`);
	}


	public expected(type: string, value?: string): void
	{
		this.error(`Expected "${type}${exists(value) ? ' (' + value + ')' : ''}"`);
	}


	public unexpected(type: string, value?: string): void
	{
		this.error(`Unexpected "${type}${exists(value) ? ' (' + value + ')' : ''}"`);
	}


	public current(): string
	{
		return this.readCharacter(this.position);
	}


	public next(): string
	{
		this.resetPeek();
		return this.readCharacter(this.position++);
	}


	public peek(peek: number = 1): string
	{
		this.peekPosition += peek;

		return this.readCharacter(this.position + this.peekPosition);
	}


	public resetPeek(): void
	{
		this.peekPosition = 0;
	}


	public eof(): boolean
	{
		return !exists(this.readCharacter(this.position));
	}


	public readWhile(fn: (ch: string) => boolean): string
	{
		let result = [];

		while (true) {
			if (this.eof()) {
				break;
			}

			let token = this.current();

			if (!fn(token)) {
				break;
			}

			result.push(token);

			this.next();
		}

		return result.join('');
	}


	public isSequenceFollowing(...sequences: Array<string>): string
	{
		for (let i = 0; i < sequences.length; i++) {
			let current = this.current();

			for (let j = 0; j < sequences[i].length - 1; j++) {
				current += this.peek();
			}

			this.resetPeek();

			if (current === sequences[i]) {
				return current;
			}
		}

		return undefined;
	}


	public matchSequence(...sequences: Array<string>): string
	{
		let following = this.isSequenceFollowing(...sequences);

		if (!exists(following)) {
			return undefined;
		}

		for (let i = 0; i < following.length; i++) {
			this.next();
		}

		return following;
	}


	private readCharacter(position: number): string
	{
		let ch = this.input.charAt(position);

		if (ch === '') {
			return undefined;
		}

		return ch;
	}

}
