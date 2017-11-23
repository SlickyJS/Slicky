import {findNodesByType} from '../../../';
import {expect} from 'chai';
import * as ts from 'typescript';


describe('#sourceFiles/findNodesByType', () => {

	describe('findNodesByType()', () => {

		it('should return all nodes by type', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile(
				'/main.ts',
				'const a = 1; const b = 2;',
				ts.ScriptTarget.Latest
			);

			const nodes = findNodesByType<ts.Identifier>(ts.SyntaxKind.Identifier, sourceFile);

			expect(nodes.length).to.be.equal(2);
			expect(nodes[0].text).to.be.equal('a');
			expect(nodes[1].text).to.be.equal('b');
		});

	});

});
