import * as _ from '../../';
import {expect} from 'chai';


describe('#Parser.returnStatement', () => {

	describe('parse()', () => {

		it('should parse expression empty return', () => {
			let ast = _.Parser.createFromString('return').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTReturnStatement,
				])
			);
		});

		it('should add return statement to member expression', () => {
			let ast = _.Parser.createFromString('a.b("c").d', {addMissingReturn: true}).parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTReturnStatement(
						new _.ASTMemberExpression(
							new _.ASTCallExpression(
								new _.ASTMemberExpression(
									new _.ASTIdentifier('a'),
									new _.ASTIdentifier('b')
								),
								[
									new _.ASTStringLiteral('c'),
								]
							),
							new _.ASTIdentifier('d')
						),
					),
				])
			);
		});

		it('should parse expression with not empty return', () => {
			let ast = _.Parser.createFromString('a; return b;').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTIdentifier('a'),
					new _.ASTReturnStatement(
						new _.ASTIdentifier('b')
					),
				])
			);
		});

		it('should add automatically return statement', () => {
			let ast = _.Parser.createFromString('a; b; c', {addMissingReturn: true}).parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTIdentifier('a'),
					new _.ASTIdentifier('b'),
					new _.ASTReturnStatement(
						new _.ASTIdentifier('c')
					),
				])
			);
		});

		it('should add automatically return statement to block', () => {
			let ast = _.Parser.createFromString('(a)', {addMissingReturn: true}).parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTReturnStatement(
						new _.ASTBlockStatement(
							[
								new _.ASTIdentifier('a'),
							]
						)
					),
				])
			);
		});

		it('should add automatically return statement with function having own return', () => {
			let ast = _.Parser.createFromString('() => {return a}; b', {addMissingReturn: true}).parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTArrowFunctionExpression(
						[],
						[
							new _.ASTReturnStatement(
								new _.ASTIdentifier('a')
							),
						]
					),
					new _.ASTReturnStatement(
						new _.ASTIdentifier('b')
					),
				])
			);
		});

		it('should add automatically return statement into function', () => {
			let ast = _.Parser.createFromString('() => {a}', {addMissingReturn: true}).parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTReturnStatement(
						new _.ASTArrowFunctionExpression(
							[],
							[
								new _.ASTReturnStatement(
									new _.ASTIdentifier('a')
								),
							]
						)
					),
				])
			);
		});

	});

});
