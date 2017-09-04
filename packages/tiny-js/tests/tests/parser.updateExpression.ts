import * as _ from '../../';
import {expect} from 'chai';


describe('#Parser.updateExpression', () => {

	describe('parse()', () => {

		it('should parse increase expression', () => {
			let ast = _.Parser.createFromString('a++').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTUpdateExpression(
						'++',
						new _.ASTIdentifier('a')
					),
				])
			);
		});

		it('should parse decrease expression', () => {
			let ast = _.Parser.createFromString('a--').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTUpdateExpression(
						'--',
						new _.ASTIdentifier('a')
					),
				])
			);
		});

	});

});
