import * as _ from '../../../';
import {expect} from 'chai';


describe('#AST/Expressions.identifier', () => {

	describe('render()', () => {

		it('should render identifier', () => {
			let identifier = new _.ASTIdentifier('a');

			expect(identifier.render()).to.be.equal('a');
		});

	});

});
