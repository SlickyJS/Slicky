import * as _ from '../../src';
import {expect} from 'chai';


describe('#Parser.voidStatement', () => {

	describe('parse()', () => {

		it('should parse expression with empty void', () => {
			let ast = _.Parser.createFromString('void').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTVoidStatement,
				])
			);
		});

		it('should parse expression with not empty void', () => {
			let ast = _.Parser.createFromString('void b').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTVoidStatement(
						new _.ASTIdentifier('b')
					),
				])
			);
		});

	});

});
