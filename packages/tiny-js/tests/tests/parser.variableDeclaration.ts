import * as _ from '../../src';
import {expect} from 'chai';


describe('#Parser.variableDeclaration', () => {

	describe('parse()', () => {

		it('should parse let', () => {
			let ast = _.Parser.createFromString('let name').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTVariableDeclaration(
						new _.ASTIdentifier('name')
					),
				])
			);
		});

		it('should parse let with value', () => {
			let ast = _.Parser.createFromString('let name = "car"').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTVariableDeclaration(
						new _.ASTIdentifier('name'),
						new _.ASTStringLiteral('car')
					),
				])
			);
		});

	});

});
