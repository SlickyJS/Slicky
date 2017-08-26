import * as _ from '../../src';
import {expect} from 'chai';


describe('#Parser.memberExpression', () => {

	describe('parse()', () => {

		it('should parse simple object access', () => {
			let ast = _.Parser.createFromString('a.b').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTMemberExpression(
						new _.ASTIdentifier('a'),
						new _.ASTIdentifier('b')
					),
				])
			);
		});

		it('should parse object access with and', () => {
			let ast = _.Parser.createFromString('a.b && c').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTLogicalExpression(
						'&&',
						new _.ASTMemberExpression(
							new _.ASTIdentifier('a'),
							new _.ASTIdentifier('b')
						),
						new _.ASTIdentifier('c')
					),
				])
			);
		});

		it('should parse object access', () => {
			let ast = _.Parser.createFromString('a.b.c').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTMemberExpression(
						new _.ASTMemberExpression(
							new _.ASTIdentifier('a'),
							new _.ASTIdentifier('b')
						),
						new _.ASTIdentifier('c')
					),
				])
			);
		});

		it('should parse call on object access', () => {
			let ast = _.Parser.createFromString('a.b()').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTCallExpression(
						new _.ASTMemberExpression(
							new _.ASTIdentifier('a'),
							new _.ASTIdentifier('b')
						),
						[]
					),
				])
			);
		});

		it('should parse object access on call', () => {
			let ast = _.Parser.createFromString('a().b').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTMemberExpression(
						new _.ASTCallExpression(
							new _.ASTIdentifier('a'),
							[]
						),
						new _.ASTIdentifier('b')
					),
				])
			);
		});

		it('should parse object access with array key and call', () => {
			let ast = _.Parser.createFromString('a[0]["b"]()').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTCallExpression(
						new _.ASTMemberExpression(
							new _.ASTMemberExpression(
								new _.ASTIdentifier('a'),
								new _.ASTArrayExpression([
									new _.ASTNumericLiteral(0),
								])
							),
							new _.ASTArrayExpression([
								new _.ASTStringLiteral('b'),
							])
						),
						[]
					),
				])
			)
		});

	});

});
