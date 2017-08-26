import * as _ from '../../../src';
import {expect} from 'chai';


describe('#AST/Declarations.variableDeclaration', () => {

	describe('render()', () => {

		it('should render variable declaration without init value', () => {
			let declaration = new _.ASTVariableDeclaration(
				new _.ASTIdentifier('a')
			);

			expect(declaration.render()).to.be.equal('var a');
		});

		it('should render variable declaration with init value', () => {
			let declaration = new _.ASTVariableDeclaration(
				new _.ASTIdentifier('a'),
				new _.ASTIdentifier('b')
			);

			expect(declaration.render()).to.be.equal('var a = b');
		});

	});

});
