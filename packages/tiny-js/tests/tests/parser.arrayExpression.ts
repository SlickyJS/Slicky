import * as _ from '../../src';
import {expect} from 'chai';


describe('#Parser.arrayExpression', () => {

	describe('parse()', () => {

		it('should parse empty array', () => {
			let ast = _.Parser.createFromString('[]').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTArrayExpression([]),
				])
			);
		});

		it('should parse array with scalar items', () => {
			let ast = _.Parser.createFromString('[true, false, "hello", 5]').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTArrayExpression([
						new _.ASTBooleanLiteral(true),
						new _.ASTBooleanLiteral(false),
						new _.ASTStringLiteral('hello'),
						new _.ASTNumericLiteral(5),
					]),
				])
			);
		});

		it('should parse array with call inside', () => {
			let ast = _.Parser.createFromString('[call()]').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTArrayExpression([
						new _.ASTCallExpression(
							new _.ASTIdentifier('call'),
							[]
						),
					]),
				])
			);
		});

		it('should parse array with arrays inside', () => {
			let ast = _.Parser.createFromString('[1, [2, [3], 4], 5]').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTArrayExpression([
						new _.ASTNumericLiteral(1),
						new _.ASTArrayExpression([
							new _.ASTNumericLiteral(2),
							new _.ASTArrayExpression([
								new _.ASTNumericLiteral(3),
							]),
							new _.ASTNumericLiteral(4),
						]),
						new _.ASTNumericLiteral(5),
					]),
				])
			);
		});

		it('should parse array with object', () => {
			let ast = _.Parser.createFromString('[{}]').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTArrayExpression([
						new _.ASTObjectExpression([]),
					]),
				])
			);
		});
	});

});
