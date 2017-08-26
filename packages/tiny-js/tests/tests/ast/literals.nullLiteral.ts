import * as _ from '../../../src';
import {expect} from 'chai';


describe('#AST/Literals.nullLiteral', () => {

	describe('render()', () => {

		it('should render null literal', () => {
			let literal = new _.ASTNullLiteral;

			expect(literal.render()).to.be.equal('null');
		});

	});

});
