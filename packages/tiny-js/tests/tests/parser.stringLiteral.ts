import * as _ from '../../';
import {expect} from 'chai';


describe('#Parser.stringLiteral', () => {

	describe('parse()', () => {

		it('should parse string', () => {
			let ast = _.Parser.createFromString('"hello world"').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTStringLiteral('hello world'),
				])
			);
		});

	});

});
