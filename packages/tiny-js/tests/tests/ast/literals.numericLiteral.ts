import * as _ from '../../../';
import {expect} from 'chai';


describe('#AST/Literals.numericLiteral', () => {

	describe('render()', () => {

		it('should render true', () => {
			let literal = new _.ASTNumericLiteral(42);

			expect(literal.render()).to.be.equal('42');
		});

	});

});
