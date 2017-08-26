import * as _ from '../../../src';
import {expect} from 'chai';


describe('#AST/Statements.blockStatement', () => {

	describe('render()', () => {

		it('should render block statement', () => {
			let block = new _.ASTBlockStatement([
				new _.ASTIdentifier('a'),
				new _.ASTIdentifier('b'),
			]);

			expect(block.render()).to.be.equal('(a; b)');
		});

	});

});
