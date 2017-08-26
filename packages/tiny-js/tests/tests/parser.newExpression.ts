import * as _ from '../../src';
import {expect} from 'chai';


describe('#Parser.newExpression', () => {

	describe('parse()', () => {

		it('should parse new expression without parenthesis', () => {
			let ast = _.Parser.createFromString('new Car').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTNewExpression(
						new _.ASTIdentifier('Car'),
						[]
					),
				])
			);
		});

		it('should parse new expression without arguments', () => {
			let ast = _.Parser.createFromString('new Car()').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTNewExpression(
						new _.ASTIdentifier('Car'),
						[]
					),
				])
			);
		});

		it('should parse new expression with arguments', () => {
			let ast = _.Parser.createFromString('new Car(arg1, arg2, arg3)').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTNewExpression(
						new _.ASTIdentifier('Car'),
						[
							new _.ASTIdentifier('arg1'),
							new _.ASTIdentifier('arg2'),
							new _.ASTIdentifier('arg3'),
						]
					),
				])
			);
		});

	});

});
