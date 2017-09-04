import * as _ from '../../';
import {expect} from 'chai';


describe('#Parser.debuggerStatement', () => {

	describe('parse()', () => {

		it('should parse null literal', () => {
			let ast = _.Parser.createFromString('debugger').parse();

			expect(ast).to.be.eql(
				new _.ASTProgram([
					new _.ASTDebuggerStatement,
				])
			);
		});

	});

});
