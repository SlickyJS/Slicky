import * as _ from '../../../';
import {expect} from 'chai';


describe('#AST/Expressions.unaryExpression', () => {

	describe('render()', () => {

		it('should render unary expression', () => {
			let unary = new _.ASTUnaryExpression(
				'-',
				new _.ASTIdentifier('a')
			);

			expect(unary.render()).to.be.equal('-a');
		});

	});

});
