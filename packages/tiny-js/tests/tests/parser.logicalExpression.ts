import * as _ from '../../src';
import {expect} from 'chai';


describe('#Parser.logicalExpression', () => {

	describe('parse()', () => {

		it('should parse and logical expression', () => {
			let ast = _.Parser.createFromString('a && b').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTLogicalExpression(
						'&&',
						new _.ASTIdentifier('a'),
						new _.ASTIdentifier('b')
					),
				])
			);
		});

	});

});
