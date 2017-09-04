import * as _ from '../../';
import {expect} from 'chai';


describe('#Parser.binaryExpression', () => {

	describe('parse()', () => {

		it('should parse simple arithmetic expression', () => {
			let ast = _.Parser.createFromString('a + b').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTBinaryExpression(
						'+',
						new _.ASTIdentifier('a'),
						new _.ASTIdentifier('b')
					),
				])
			);
		});

		it('should parse arithmetic expression', () => {
			let ast = _.Parser.createFromString('a + b / c').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTBinaryExpression(
						'+',
						new _.ASTIdentifier('a'),
						new _.ASTBinaryExpression(
							'/',
							new _.ASTIdentifier('b'),
							new _.ASTIdentifier('c')
						)
					),
				])
			);
		});

	});

});
