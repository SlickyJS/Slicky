import {Tokenizer, TokenType, Token} from '../../';
import {expect} from 'chai';


let expectToken = (token: Token, type: TokenType, value: string|number): void => {
	expect(token).to.be.eql({
		type: type,
		value: value,
	});
};


describe('#Tokenizer', () => {

	describe('next()', () => {

		it('should read all tokens', () => {
			let tokenizer = Tokenizer.createFromString('let a = true ? alert("true") : console.log({b: 5}); return null;');

			expectToken(tokenizer.next(), TokenType.Keyword, 'let');
			expectToken(tokenizer.next(), TokenType.Name, 'a');
			expectToken(tokenizer.next(), TokenType.Operator, '=');
			expectToken(tokenizer.next(), TokenType.Keyword, 'true');
			expectToken(tokenizer.next(), TokenType.Operator, '?');
			expectToken(tokenizer.next(), TokenType.Name, 'alert');
			expectToken(tokenizer.next(), TokenType.Punctuation, '(');
			expectToken(tokenizer.next(), TokenType.String, 'true');
			expectToken(tokenizer.next(), TokenType.Punctuation, ')');
			expectToken(tokenizer.next(), TokenType.Operator, ':');
			expectToken(tokenizer.next(), TokenType.Name, 'console');
			expectToken(tokenizer.next(), TokenType.Punctuation, '.');
			expectToken(tokenizer.next(), TokenType.Name, 'log');
			expectToken(tokenizer.next(), TokenType.Punctuation, '(');
			expectToken(tokenizer.next(), TokenType.Punctuation, '{');
			expectToken(tokenizer.next(), TokenType.Name, 'b');
			expectToken(tokenizer.next(), TokenType.Operator, ':');
			expectToken(tokenizer.next(), TokenType.Number, '5');
			expectToken(tokenizer.next(), TokenType.Punctuation, '}');
			expectToken(tokenizer.next(), TokenType.Punctuation, ')');
			expectToken(tokenizer.next(), TokenType.Punctuation, ';');
			expectToken(tokenizer.next(), TokenType.Keyword, 'return');
			expectToken(tokenizer.next(), TokenType.Keyword, 'null');
			expectToken(tokenizer.next(), TokenType.Punctuation, ';');
			expect(tokenizer.eof()).to.be.equal(true);
		});

		it('should tokenize filters', () => {
			let tokenizer = Tokenizer.createFromString('a | filterA | filterB : "option" : 5 : [] | filterC');

			expectToken(tokenizer.next(), TokenType.Name, 'a');
			expectToken(tokenizer.next(), TokenType.Operator, '|');
			expectToken(tokenizer.next(), TokenType.Name, 'filterA');
			expectToken(tokenizer.next(), TokenType.Operator, '|');
			expectToken(tokenizer.next(), TokenType.Name, 'filterB');
			expectToken(tokenizer.next(), TokenType.Operator, ':');
			expectToken(tokenizer.next(), TokenType.String, 'option');
			expectToken(tokenizer.next(), TokenType.Operator, ':');
			expectToken(tokenizer.next(), TokenType.Number, '5');
			expectToken(tokenizer.next(), TokenType.Operator, ':');
			expectToken(tokenizer.next(), TokenType.Punctuation, '[');
			expectToken(tokenizer.next(), TokenType.Punctuation, ']');
			expectToken(tokenizer.next(), TokenType.Operator, '|');
			expectToken(tokenizer.next(), TokenType.Name, 'filterC');
			expect(tokenizer.eof()).to.be.equal(true);
		});

		it('should parse and', () => {
			let tokenizer = Tokenizer.createFromString('&&');

			expectToken(tokenizer.next(), TokenType.Operator, '&&');
			expect(tokenizer.eof()).to.be.equal(true);
		});

		it('should parse or', () => {
			let tokenizer = Tokenizer.createFromString('||');

			expectToken(tokenizer.next(), TokenType.Operator, '||');
			expect(tokenizer.eof()).to.be.equal(true);
		});

		it('should parse minus equal', () => {
			let tokenizer = Tokenizer.createFromString('-=');

			expectToken(tokenizer.next(), TokenType.Operator, '-=');
			expect(tokenizer.eof()).to.be.equal(true);
		});

		it('should parse plus equal', () => {
			let tokenizer = Tokenizer.createFromString('+=');

			expectToken(tokenizer.next(), TokenType.Operator, '+=');
			expect(tokenizer.eof()).to.be.equal(true);
		});

		it('should parse double minus', () => {
			let tokenizer = Tokenizer.createFromString('--');

			expectToken(tokenizer.next(), TokenType.Operator, '--');
			expect(tokenizer.eof()).to.be.equal(true);
		});

		it('should parse double plus', () => {
			let tokenizer = Tokenizer.createFromString('++');

			expectToken(tokenizer.next(), TokenType.Operator, '++');
			expect(tokenizer.eof()).to.be.equal(true);
		});

		it('should parse less or equal', () => {
			let tokenizer = Tokenizer.createFromString('<=');

			expectToken(tokenizer.next(), TokenType.Operator, '<=');
			expect(tokenizer.eof()).to.be.equal(true);
		});

		it('should parse more or equal', () => {
			let tokenizer = Tokenizer.createFromString('>=');

			expectToken(tokenizer.next(), TokenType.Operator, '>=');
			expect(tokenizer.eof()).to.be.equal(true);
		});

		it('should parse double equals', () => {
			let tokenizer = Tokenizer.createFromString('==');

			expectToken(tokenizer.next(), TokenType.Operator, '==');
			expect(tokenizer.eof()).to.be.equal(true);
		});

		it('should parse double not equals', () => {
			let tokenizer = Tokenizer.createFromString('!=');

			expectToken(tokenizer.next(), TokenType.Operator, '!=');
			expect(tokenizer.eof()).to.be.equal(true);
		});

		it('should parse triple equals', () => {
			let tokenizer = Tokenizer.createFromString('===');

			expectToken(tokenizer.next(), TokenType.Operator, '===');
			expect(tokenizer.eof()).to.be.equal(true);
		});

		it('should parse triple not equals', () => {
			let tokenizer = Tokenizer.createFromString('!==');

			expectToken(tokenizer.next(), TokenType.Operator, '!==');
			expect(tokenizer.eof()).to.be.equal(true);
		});

		it('should read escaped string with single quotes', () => {
			let tokenizer = Tokenizer.createFromString("'hello \\'world\\''");

			expectToken(tokenizer.next(), TokenType.String, "hello \'world\'");
			expect(tokenizer.eof()).to.be.equal(true);
		});

		it('should read escaped string with double quotes', () => {
			let tokenizer = Tokenizer.createFromString('"hello \\"world\\""');

			expectToken(tokenizer.next(), TokenType.String, 'hello \"world\"');
			expect(tokenizer.eof()).to.be.equal(true);
		});

		it('should read int', () => {
			let tokenizer = Tokenizer.createFromString('53');

			expectToken(tokenizer.next(), TokenType.Number, '53');
			expect(tokenizer.eof()).to.be.equal(true);
		});

		it('should read float', () => {
			let tokenizer = Tokenizer.createFromString('53.34534');

			expectToken(tokenizer.next(), TokenType.Number, '53.34534');
			expect(tokenizer.eof()).to.be.equal(true);
		});

		it('should read interval name', () => {
			let tokenizer = Tokenizer.createFromString('interval in intervals');

			expectToken(tokenizer.next(), TokenType.Name, 'interval');
			expectToken(tokenizer.next(), TokenType.Keyword, 'in');
			expectToken(tokenizer.next(), TokenType.Name, 'intervals');
			expect(tokenizer.eof()).to.be.equal(true);
		});

	});

	describe('eof()', () => {

		it('should signalize end of expression', () => {
			let tokenizer = Tokenizer.createFromString('');

			expect(tokenizer.eof()).to.be.equal(true);
		});

		it('should not signalize end of expression', () => {
			let tokenizer = Tokenizer.createFromString('"hello"');

			expect(tokenizer.eof()).to.be.equal(false);
		});

	});

});
