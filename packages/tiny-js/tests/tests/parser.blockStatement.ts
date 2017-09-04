import * as _ from '../../';
import {expect} from 'chai';


describe('#Parser.blockStatement', () => {

	describe('parse()', () => {

		it('should parse expression inside of scope', () => {
			let ast = _.Parser.createFromString('(a)').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTBlockStatement([
						new _.ASTIdentifier('a'),
					]),
				])
			);
		});

	});

});
