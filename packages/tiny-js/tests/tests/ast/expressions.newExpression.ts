import * as _ from '../../../src';
import {expect} from 'chai';


describe('#AST/Expressions.newExpression', () => {

	describe('render()', () => {

		it('should render new expression', () => {
			let expression = new _.ASTNewExpression(
				new _.ASTIdentifier('A'),
				[
					new _.ASTIdentifier('arg1'),
					new _.ASTIdentifier('arg2'),
					new _.ASTIdentifier('arg3'),
				]
			);

			expect(expression.render()).to.be.equal('new A(arg1, arg2, arg3)');
		});

	});

});
