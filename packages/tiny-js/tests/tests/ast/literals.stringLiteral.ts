import * as _ from '../../../';
import {expect} from 'chai';


describe('#AST/Literals.stringLiteral', () => {

	describe('render()', () => {

		it('should render null literal', () => {
			let literal = new _.ASTStringLiteral('hello');

			expect(literal.render()).to.be.equal("'hello'");
		});

	});

});
