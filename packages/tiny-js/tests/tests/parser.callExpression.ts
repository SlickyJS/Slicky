import * as _ from '../../src';
import {expect} from 'chai';


describe('#Parser.callExpression', () => {

	describe('parse()', () => {

		it('should parse simple call', () => {
			let ast = _.Parser.createFromString('call()').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTCallExpression(
						new _.ASTIdentifier('call'),
						[]
					),
				])
			);
		});

		it('should parse call with scalar arguments', () => {
			let ast = _.Parser.createFromString('call(true, false, "hello", 5)').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTCallExpression(
						new _.ASTIdentifier('call'),
						[
							new _.ASTBooleanLiteral(true),
							new _.ASTBooleanLiteral(false),
							new _.ASTStringLiteral('hello'),
							new _.ASTNumericLiteral(5),
						]
					)
				])
			);
		});

		it('should parse call with array in arguments', () => {
			let ast = _.Parser.createFromString('call([])').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTCallExpression(
						new _.ASTIdentifier('call'),
						[
							new _.ASTArrayExpression([]),
						]
					),
				])
			);
		});

		it('should parse call with object', () => {
			let ast = _.Parser.createFromString('call({})').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTCallExpression(
						new _.ASTIdentifier('call'),
						[
							new _.ASTObjectExpression([]),
						]
					),
				])
			);
		});

		it('should parse call with another call in arguments', () => {
			let ast = _.Parser.createFromString('call(call())').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTCallExpression(
						new _.ASTIdentifier('call'),
						[
							new _.ASTCallExpression(
								new _.ASTIdentifier('call'),
								[]
							),
						]
					),
				])
			);
		});

		it('should parse calls on call results', () => {
			let ast = _.Parser.createFromString('call(1)(2)(3)').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTCallExpression(
						new _.ASTCallExpression(
							new _.ASTCallExpression(
								new _.ASTIdentifier('call'),
								[
									new _.ASTNumericLiteral(1),
								]
							),
							[
								new _.ASTNumericLiteral(2),
							]
						),
						[
							new _.ASTNumericLiteral(3),
						]
					),
				])
			);
		});

	});

});
