import * as _ from '../../../src';
import {expect} from 'chai';


describe('#AST/Expressions.updateExpression', () => {

	describe('render()', () => {

		it('should render update expression', () => {
			let update = new _.ASTUpdateExpression(
				'--',
				new _.ASTIdentifier('a')
			);

			expect(update.render()).to.be.equal('a--');
		});

	});

});
