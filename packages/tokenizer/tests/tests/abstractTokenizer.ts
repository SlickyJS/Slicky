import {TestTokenizer} from '../mocks/testTokenizer';
import {InputStream} from '../..';
import {expect} from 'chai';


describe('#AbstractTokenizer', () => {

	describe('next()', () => {

		it('should read simple string tokens', () => {
			let tokenizer = new TestTokenizer(new InputStream('hello'));

			expect(tokenizer.next()).to.be.eql('hello');

			expect(tokenizer.eof()).to.be.equal(true);
		});

		it('should read more tokens', () => {
			let tokenizer = new TestTokenizer(new InputStream('hello david'));

			expect(tokenizer.next()).to.be.eql('hello');
			expect(tokenizer.next()).to.be.eql('david');

			expect(tokenizer.eof()).to.be.equal(true);
		});

	});

	describe('tokenize()', () => {

		it('should return all tokens', () => {
			let tokenizer = new TestTokenizer(new InputStream('hello david'));

			expect(tokenizer.tokenize()).to.be.eql([
				'hello',
				'david',
			]);
		});

	});

});
