import * as _ from '../../';
import {expect} from 'chai';


describe('#Parser.nullLiteral', () => {

	describe('parse()', () => {

		it('should parse null literal', () => {
			let ast = _.Parser.createFromString('null').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTNullLiteral,
				])
			);
		});

	});

});
