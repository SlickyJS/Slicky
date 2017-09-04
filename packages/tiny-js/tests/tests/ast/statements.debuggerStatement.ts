import * as _ from '../../../';
import {expect} from 'chai';


describe('#AST/Statements.debuggerStatement', () => {

	describe('render()', () => {

		it('should render debugger statement', () => {
			let block = new _.ASTDebuggerStatement;

			expect(block.render()).to.be.equal('debugger');
		});

	});

});
