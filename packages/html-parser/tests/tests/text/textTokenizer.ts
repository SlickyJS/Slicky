import {InputStream} from '@slicky/tokenizer';

import {TextTokenizer, TextToken, TextTokenText, TextTokenExpression} from '../../../';
import {expect} from 'chai';


function tokenize(text: string): Array<TextToken>
{
	return (new TextTokenizer(new InputStream(text))).tokenize();
}


describe('#Text/TextTokenizer', () => {

	describe('tokenize()', () => {

		it('tokenizes a text template', () => {
			let tokens = tokenize('Hello {{ user.name }}, you have {{ user.messages.unread | length }} unread messages.');

			expect(tokens).to.be.eql([
				new TextTokenText('Hello '),
				new TextTokenExpression('user.name'),
				new TextTokenText(', you have '),
				new TextTokenExpression('user.messages.unread | length'),
				new TextTokenText(' unread messages.'),
			]);
		});

		it('should return a single text token when without any binding fragments', () => {
			let tokens = tokenize('Hello World!');

			expect(tokens).be.eql([
				new TextTokenText('Hello World!'),
			]);
		});

		it('should return a single binding token when with only one binding fragment', () => {
			let tokens = tokenize('{{ user.name }}');

			expect(tokens).to.be.eql([
				new TextTokenExpression('user.name'),
			]);
		});

	});

});
