import * as _ from '../../../src';
import {expect} from 'chai';


describe('#AST/Expressions.objectExpression', () => {

	describe('render()', () => {

		it('should render array expression', () => {
			let array = new _.ASTObjectExpression([
				new _.ASTObjectMember(
					new _.ASTIdentifier('a'),
					new _.ASTIdentifier('A')
				),
				new _.ASTObjectMember(
					new _.ASTIdentifier('b'),
					new _.ASTIdentifier('B'),
				),
			]);

			expect(array.render()).to.be.equal('{a: A, b: B}');
		});

	});

});
