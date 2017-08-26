import * as _ from '../../src';
import {expect} from 'chai';


describe('#Parser.filterExpression', () => {

	describe('parse()', () => {

		it('should parse filter without arguments', () => {
			let ast = _.Parser.createFromString('a | filterA').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTFilterExpression(
						new _.ASTIdentifier('filterA'),
						new _.ASTIdentifier('a'),
						[]
					),
				])
			);
		});

		it('should parse filter with arguments', () => {
			let ast = _.Parser.createFromString('a | filterA : arg1 : arg2 : arg3').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTFilterExpression(
						new _.ASTIdentifier('filterA'),
						new _.ASTIdentifier('a'),
						[
							new _.ASTIdentifier('arg1'),
							new _.ASTIdentifier('arg2'),
							new _.ASTIdentifier('arg3'),
						]
					),
				])
			)
		});

		it('should parse many filters without arguments', () => {
			let ast = _.Parser.createFromString('a | filterA | filterB | filterC').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTFilterExpression(
						new _.ASTIdentifier('filterC'),
						new _.ASTFilterExpression(
							new _.ASTIdentifier('filterB'),
							new _.ASTFilterExpression(
								new _.ASTIdentifier('filterA'),
								new _.ASTIdentifier('a'),
								[]
							),
							[]
						),
						[]
					),
				])
			);
		});

		it('should parse filters inside of scope', () => {
			let ast = _.Parser.createFromString('(a | filterA) | filterB').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTFilterExpression(
						new _.ASTIdentifier('filterB'),
						new _.ASTBlockStatement([
							new _.ASTFilterExpression(
								new _.ASTIdentifier('filterA'),
								new _.ASTIdentifier('a'),
								[]
							),
						]),
						[]
					),
				])
			);
		});

		it('should parse many filters with arguments', () => {
			let ast = _.Parser.createFromString('a | filterA : argA | filterB : argB | filterC : argC').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTFilterExpression(
						new _.ASTIdentifier('filterC'),
						new _.ASTFilterExpression(
							new _.ASTIdentifier('filterB'),
							new _.ASTFilterExpression(
								new _.ASTIdentifier('filterA'),
								new _.ASTIdentifier('a'),
								[
									new _.ASTIdentifier('argA'),
								]
							),
							[
								new _.ASTIdentifier('argB'),
							]
						),
						[
							new _.ASTIdentifier('argC'),
						]
					),
				])
			);
		});

		it('should parse multiple expressions with filters', () => {
			let ast = _.Parser.createFromString('a | a1 | a2; b | b1 | b2; c | c1 | c2').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTFilterExpression(
						new _.ASTIdentifier('a2'),
						new _.ASTFilterExpression(
							new _.ASTIdentifier('a1'),
							new _.ASTIdentifier('a'),
							[]
						),
						[]
					),
					new _.ASTFilterExpression(
						new _.ASTIdentifier('b2'),
						new _.ASTFilterExpression(
							new _.ASTIdentifier('b1'),
							new _.ASTIdentifier('b'),
							[]
						),
						[]
					),
					new _.ASTFilterExpression(
						new _.ASTIdentifier('c2'),
						new _.ASTFilterExpression(
							new _.ASTIdentifier('c1'),
							new _.ASTIdentifier('c'),
							[]
						),
						[]
					),
				])
			);
		});

	});

});
