import * as _ from '../../../';
import {expect} from 'chai';


describe('#AST/Statements.returnStatement', () => {

	describe('render()', () => {

		it('should render return statement without argument', () => {
			let statement = new _.ASTReturnStatement;

			expect(statement.render()).to.be.equal('return');
		});

		it('should render return statement with argument', () => {
			let statement = new _.ASTReturnStatement(
				new _.ASTIdentifier('a')
			);

			expect(statement.render()).to.be.equal('return a');
		});

	});

});
