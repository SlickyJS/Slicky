import * as _ from '../../';
import {expect} from 'chai';


describe('#Parser.unaryExpression', () => {

	describe('parse()', () => {

		it('should parse unary expression', () => {
			let ast = _.Parser.createFromString('-a').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTUnaryExpression(
						'-',
						new _.ASTIdentifier('a')
					),
				])
			);
		});

	});

});
