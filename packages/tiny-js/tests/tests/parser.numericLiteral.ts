import * as _ from '../../';
import {expect} from 'chai';


describe('#Parser.numericLiteral', () => {

	describe('parse()', () => {

		it('should parse integer', () => {
			let ast = _.Parser.createFromString('5').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTNumericLiteral(5),
				])
			);
		});

		it('should parse float', () => {
			let ast = _.Parser.createFromString('4.32').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTNumericLiteral(4.32),
				])
			);
		});

	});

});
