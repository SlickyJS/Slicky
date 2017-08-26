import * as _ from '../../../src';
import {expect} from 'chai';


describe('#AST/Expressions.assignmentExpression', () => {

	describe('render()', () => {

		it('should render assignment expression', () => {
			let assignment = new _.ASTAssignmentExpression(
				'=',
				new _.ASTIdentifier('a'),
				new _.ASTIdentifier('b')
			);

			expect(assignment.render()).to.be.equal('a = b');
		});

	});

});
