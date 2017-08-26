import * as _ from '../../../src';
import {expect} from 'chai';


describe('#AST/Expressions.conditionalExpression', () => {

	describe('render()', () => {

		it('should render conditional expression', () => {
			let expression = new _.ASTConditionalExpression(
				new _.ASTIdentifier('a'),
				new _.ASTIdentifier('b'),
				new _.ASTIdentifier('c'),
			);

			expect(expression.render()).to.be.equal('a ? b : c');
		});

	});

});
