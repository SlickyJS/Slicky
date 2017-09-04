import * as _ from '../../../';
import {expect} from 'chai';


describe('#AST/Expressions.arrayExpression', () => {

	describe('render()', () => {

		it('should render array expression', () => {
			let array = new _.ASTArrayExpression([
				new _.ASTIdentifier('a'),
				new _.ASTIdentifier('b'),
			]);

			expect(array.render()).to.be.equal('[a, b]');
		});

	});

});
