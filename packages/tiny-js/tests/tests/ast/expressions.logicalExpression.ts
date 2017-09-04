import * as _ from '../../../';
import {expect} from 'chai';


describe('#AST/Expressions.logicalExpression', () => {

	describe('render()', () => {

		it('should render logical expression', () => {
			let logical = new _.ASTLogicalExpression(
				'&&',
				new _.ASTIdentifier('a'),
				new _.ASTIdentifier('b')
			);

			expect(logical.render()).to.be.equal('a && b');
		});

	});

});
