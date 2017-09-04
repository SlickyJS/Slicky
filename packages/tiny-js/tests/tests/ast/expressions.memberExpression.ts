import * as _ from '../../../';
import {expect} from 'chai';


describe('#AST/Expressions.memberExpression', () => {

	describe('render()', () => {

		it('should render member expression with identifier property', () => {
			let assignment = new _.ASTMemberExpression(
				new _.ASTIdentifier('a'),
				new _.ASTIdentifier('b')
			);

			expect(assignment.render()).to.be.equal('a.b');
		});

		it('should render member expression with array property', () => {
			let assignment = new _.ASTMemberExpression(
				new _.ASTIdentifier('a'),
				new _.ASTArrayExpression([
					new _.ASTIdentifier('b'),
				])
			);

			expect(assignment.render()).to.be.equal('a[b]');
		});

	});

});
