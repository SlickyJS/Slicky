import * as _ from '../../';
import {expect} from 'chai';


describe('#Parser.throwStatement', () => {

	describe('parse()', () => {

		it('should parse throw statement', () => {
			let ast = _.Parser.createFromString('throw "Error"').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTThrowStatement(
						new _.ASTStringLiteral('Error')
					),
				])
			);
		});

	});

});
