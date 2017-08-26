import * as _ from '../../src';
import {expect} from 'chai';


describe('#Parser.assignExpression', () => {

	describe('parse()', () => {

		it('should parse assign with equal', () => {
			let ast = _.Parser.createFromString('name = "car"').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTAssignmentExpression(
						'=',
						new _.ASTIdentifier('name'),
						new _.ASTStringLiteral('car')
					),
				])
			);
		});

	});

});
