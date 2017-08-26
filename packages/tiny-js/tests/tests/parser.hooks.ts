import * as _ from '../../src';
import {merge} from '@slicky/utils';
import {expect} from 'chai';


describe('#Parser.hooks', () => {

	describe('parse()', () => {

		it('should update variable identifier', () => {
			let ast = _.Parser.createFromString('a; {b: b}', {
				variableHook: (identifier: _.ASTIdentifier) => {
					return new _.ASTMemberExpression(
						new _.ASTIdentifier('_'),
						identifier
					);
				}
			}).parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTMemberExpression(
						new _.ASTIdentifier('_'),
						new _.ASTIdentifier('a')
					),
					new _.ASTObjectExpression([
						new _.ASTObjectMember(
							new _.ASTIdentifier('b'),
							new _.ASTMemberExpression(
								new _.ASTIdentifier('_'),
								new _.ASTIdentifier('b')
							)
						),
					]),
				])
			);
		});

		it('should not update local variable created with function parameter', () => {
			let ast = _.Parser.createFromString('let l = 42; (a) => l + a + b', {
				variableHook: (identifier: _.ASTIdentifier, declaration: _.ParserVariableDeclaration) => {
					if (declaration === _.ParserVariableDeclaration.Global) {
						return new _.ASTMemberExpression(
							new _.ASTIdentifier('_'),
							identifier
						);

					} else if (declaration === _.ParserVariableDeclaration.Local) {
						return new _.ASTMemberExpression(
							new _.ASTIdentifier('$'),
							identifier
						);
					}
				}
			}).parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTVariableDeclaration(
						new _.ASTIdentifier('l'),
						new _.ASTNumericLiteral(42)
					),
					new _.ASTArrowFunctionExpression(
						[
							new _.ASTIdentifier('a'),
						],
						new _.ASTReturnStatement(
							new _.ASTBinaryExpression(
								'+',
								new _.ASTMemberExpression(
									new _.ASTIdentifier('$'),
									new _.ASTIdentifier('l')
								),
								new _.ASTBinaryExpression(
									'+',
									new _.ASTIdentifier('a'),
									new _.ASTMemberExpression(
										new _.ASTIdentifier('_'),
										new _.ASTIdentifier('b')
									)
								)
							)
						)
					),
				])
			);
		});

		it('should use custom variable declaration hook', () => {
			let ast = _.Parser.createFromString('let a = 42', {
				variableDeclarationHook: (variable: _.ASTVariableDeclaration) => {
					return new _.ASTAssignmentExpression(
						'=',
						new _.ASTMemberExpression(
							new _.ASTIdentifier('$'),
							new _.ASTIdentifier(variable.name.name)
						),
						variable.init
					)
				},
			}).parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTAssignmentExpression(
						'=',
						new _.ASTMemberExpression(
							new _.ASTIdentifier('$'),
							new _.ASTIdentifier('a')
						),
						new _.ASTNumericLiteral(42)
					),
				])
			);
		});

		it('should hook to filter expression', () => {
			let ast = _.Parser.createFromString('a | filterA : arg1 : arg2', {
				filterExpressionHook: (filter: _.ASTFilterExpression) => {
					let args = [
						new _.ASTStringLiteral(filter.name.name),
						filter.modify
					];

					args = merge(args, filter.arguments);

					return new _.ASTCallExpression(
						new _.ASTIdentifier('filter'),
						args
					)
				},
			}).parse();

			expect(ast).to.be.eql(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTCallExpression(
						new _.ASTIdentifier('filter'),
						[
							new _.ASTStringLiteral('filterA'),
							new _.ASTIdentifier('a'),
							new _.ASTIdentifier('arg1'),
							new _.ASTIdentifier('arg2'),
						]
					),
				])
			);
		});

	});

});
