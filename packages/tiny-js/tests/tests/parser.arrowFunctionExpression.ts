import * as _ from '../../src';
import {expect} from 'chai';


describe('#Parser.arrowFunctionExpression', () => {

	describe('parse()', () => {

		it('should parse function without arguments', () => {
			let ast = _.Parser.createFromString('() => a').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTArrowFunctionExpression(
						[],
						new _.ASTReturnStatement(
							new _.ASTIdentifier('a')
						)
					),
				])
			);
		});

		it('should parse function with arguments', () => {
			let ast = _.Parser.createFromString('(arg1, arg2, arg3) => a').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTArrowFunctionExpression(
						[
							new _.ASTIdentifier('arg1'),
							new _.ASTIdentifier('arg2'),
							new _.ASTIdentifier('arg3'),
						],
						new _.ASTReturnStatement(
							new _.ASTIdentifier('a')
						)
					),
				])
			);
		});

		it('should parse function with body', () => {
			let ast = _.Parser.createFromString('(arg1, arg2, arg3) => {a; b; c}').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTArrowFunctionExpression(
						[
							new _.ASTIdentifier('arg1'),
							new _.ASTIdentifier('arg2'),
							new _.ASTIdentifier('arg3'),
						],
						[
							new _.ASTIdentifier('a'),
							new _.ASTIdentifier('b'),
							new _.ASTIdentifier('c'),
						]
					),
				])
			);
		});

		it('should parse function with own return', () => {
			let ast = _.Parser.createFromString('() => {a; return b;}').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTArrowFunctionExpression(
						[],
						[
							new _.ASTIdentifier('a'),
							new _.ASTReturnStatement(
								new _.ASTIdentifier('b')
							),
						]
					),
				])
			);
		});

	});

});
