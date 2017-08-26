import * as _ from '../../src';
import {expect} from 'chai';


describe('#Parser.conditionalExpression', () => {

	describe('parse()', () => {

		it('should parse conditional expression', () => {
			let ast = _.Parser.createFromString('a ? b : c').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTConditionalExpression(
						new _.ASTIdentifier('a'),
						new _.ASTIdentifier('b'),
						new _.ASTIdentifier('c')
					),
				])
			);
		});

		it('should parse conditional expression without right side', () => {
			let ast = _.Parser.createFromString('a ? b').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTConditionalExpression(
						new _.ASTIdentifier('a'),
						new _.ASTIdentifier('b'),
						new _.ASTUnaryExpression(
							'void',
							new _.ASTNumericLiteral(0)
						)
					),
				])
			);
		});

	});

});
