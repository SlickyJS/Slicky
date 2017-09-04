import * as _ from '../../../';
import {expect} from 'chai';


describe('#AST/Programs', () => {

	describe('render()', () => {

		it('should render program', () => {
			let program = new _.ASTProgram([
				new _.ASTIdentifier('a'),
				new _.ASTIdentifier('b'),
			]);

			expect(program.render()).to.be.equal('a; b');
		});

	});

});
