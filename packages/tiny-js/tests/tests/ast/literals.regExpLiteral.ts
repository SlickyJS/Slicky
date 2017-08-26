import * as _ from '../../../src';
import {expect} from 'chai';


describe('#AST/Literals.regExpLiteral', () => {

	describe('render()', () => {

		it('should render regExp literal', () => {
			let regExp = new _.ASTRegExpLiteral(
				'[a-z]',
				'gi'
			);

			expect(regExp.render()).to.be.equal('/[a-z]/gi');
		});

	});

});
