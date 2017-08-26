import * as _ from '../../../src';
import {expect} from 'chai';


describe('#AST/Statements.throwStatement', () => {

	describe('render()', () => {

		it('should render throw statement', () => {
			let statement = new _.ASTThrowStatement(
				new _.ASTIdentifier('a')
			);

			expect(statement.render()).to.be.equal('throw a');
		});

	});

});
