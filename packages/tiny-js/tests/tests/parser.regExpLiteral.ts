import * as _ from '../../src';
import {expect} from 'chai';


describe('#Parser.regExpLiteral', () => {

	describe('parse()', () => {

		it('should parse regExp literal without flags', () => {
			let ast = _.Parser.createFromString('/[a-z]/').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTRegExpLiteral(
						'[a-z]',
						''
					),
				])
			);
		});

		it('should parse regExp literal with flags', () => {
			let ast = _.Parser.createFromString('/[a-z]/gi').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTRegExpLiteral(
						'[a-z]',
						'gi'
					),
				])
			);
		});

	});

});
