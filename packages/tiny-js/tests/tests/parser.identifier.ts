import * as _ from '../../src';
import {expect} from 'chai';


describe('#Parser.identifier', () => {

	describe('parse()', () => {

		it('should parse variable', () => {
			let ast = _.Parser.createFromString('car').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTIdentifier('car'),
				])
			);
		});

		it('should parse variable with dollar', () => {
			let ast = _.Parser.createFromString('$car').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTIdentifier('$car'),
				])
			);
		});

	});

});
