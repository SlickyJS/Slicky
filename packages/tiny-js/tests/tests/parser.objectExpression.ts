import * as _ from '../../';
import {expect} from 'chai';


describe('#Parser.objectExpression', () => {

	describe('parse()', () => {

		it('should parse empty object', () => {
			let ast = _.Parser.createFromString('{}').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTObjectExpression([]),
				])
			);
		});

		it('should parse object with scalar key', () => {
			let ast = _.Parser.createFromString('{a: 1}').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTObjectExpression([
						new _.ASTObjectMember(
							new _.ASTIdentifier('a'),
							new _.ASTNumericLiteral(1)
						),
					]),
				])
			);
		});

		it('should parse object with string key', () => {
			let ast = _.Parser.createFromString('{"a": 1}').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTObjectExpression([
						new _.ASTObjectMember(
							new _.ASTStringLiteral('a'),
							new _.ASTNumericLiteral(1)
						),
					]),
				])
			);
		});

		it('should parse object with number key', () => {
			let ast = _.Parser.createFromString('{1: 1}').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTObjectExpression([
						new _.ASTObjectMember(
							new _.ASTNumericLiteral(1),
							new _.ASTNumericLiteral(1)
						),
					]),
				])
			);
		});

		it('should parse object with inner objects', () => {
			let ast = _.Parser.createFromString('{a: 1, b: {c: 2, d: {e: 3}, f: 4}, g: 5}').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTObjectExpression([
						new _.ASTObjectMember(
							new _.ASTIdentifier('a'),
							new _.ASTNumericLiteral(1),
						),
						new _.ASTObjectMember(
							new _.ASTIdentifier('b'),
							new _.ASTObjectExpression([
								new _.ASTObjectMember(
									new _.ASTIdentifier('c'),
									new _.ASTNumericLiteral(2)
								),
								new _.ASTObjectMember(
									new _.ASTIdentifier('d'),
									new _.ASTObjectExpression([
										new _.ASTObjectMember(
											new _.ASTIdentifier('e'),
											new _.ASTNumericLiteral(3)
										),
									]),
								),
								new _.ASTObjectMember(
									new _.ASTIdentifier('f'),
									new _.ASTNumericLiteral(4)
								),
							])
						),
						new _.ASTObjectMember(
							new _.ASTIdentifier('g'),
							new _.ASTNumericLiteral(5)
						),
					]),
				])
			);
		});

	});

});
