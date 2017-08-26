import * as _ from '../../src';
import {expect} from 'chai';


describe('#Parser', () => {

	describe('parse()', () => {

		it('should parse object access', () => {
			let ast = _.Parser.createFromString('a["b"].c[4].d').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTMemberExpression(
						new _.ASTMemberExpression(
							new _.ASTMemberExpression(
								new _.ASTMemberExpression(
									new _.ASTIdentifier('a'),
									new _.ASTArrayExpression([
										new _.ASTStringLiteral('b'),
									])
								),
								new _.ASTIdentifier('c'),
							),
							new _.ASTArrayExpression([
								new _.ASTNumericLiteral(4),
							])
						),
						new _.ASTIdentifier('d')
					),
				])
			);
		});

		it('should parse more expressions', () => {
			let ast = _.Parser.createFromString('a; b; c').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTIdentifier('a'),
					new _.ASTIdentifier('b'),
					new _.ASTIdentifier('c'),
				])
			);
		});

	});

});
