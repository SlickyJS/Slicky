import * as _ from '../../../';
import {expect} from 'chai';


describe('#AST/Expressions.binaryExpression', () => {

	describe('render()', () => {

		it('should render binary expression', () => {
			let binary = new _.ASTBinaryExpression(
				'-',
				new _.ASTIdentifier('a'),
				new _.ASTIdentifier('b')
			);

			expect(binary.render()).to.be.equal('a - b');
		});

	});

});
