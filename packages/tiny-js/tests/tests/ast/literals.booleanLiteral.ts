import * as _ from '../../../';
import {expect} from 'chai';


describe('#AST/Literals.booleanLiteral', () => {

	describe('render()', () => {

		it('should render true', () => {
			let literal = new _.ASTBooleanLiteral(true);

			expect(literal.render()).to.be.equal('true');
		});

		it('should render false', () => {
			let literal = new _.ASTBooleanLiteral(false);

			expect(literal.render()).to.be.equal('false');
		});

	});

});
