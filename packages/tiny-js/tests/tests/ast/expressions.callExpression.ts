import * as _ from '../../../';
import {expect} from 'chai';


describe('#AST/Expressions.callExpression', () => {

	describe('render()', () => {

		it('should render call expression', () => {
			let call = new _.ASTCallExpression(
				new _.ASTIdentifier('a'),
				[
					new _.ASTIdentifier('arg1'),
					new _.ASTIdentifier('arg2'),
					new _.ASTIdentifier('arg3'),
				]
			);

			expect(call.render()).to.be.equal('a(arg1, arg2, arg3)');
		});

	});

});
