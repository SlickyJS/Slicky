import * as _ from '../../';
import {expect} from 'chai';


describe('#Parser.booleanLiteral', () => {

	describe('parse()', () => {

		it('should parse true', () => {
			let ast = _.Parser.createFromString('true').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTBooleanLiteral(true),
				])
			);
		});

		it('should parse false', () => {
			let ast = _.Parser.createFromString('false').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTBooleanLiteral(false),
				])
			);
		});

	});

});
