import {findLastNodeOfType} from '../../../';
import {expect} from 'chai';
import * as ts from 'typescript';


describe('#sourceFiles/findLastNodeOfType', () => {

	describe('findLastNodeOfType()', () => {

		it('should return undefined if node does not exists', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile('/main.ts', '', ts.ScriptTarget.Latest);

			expect(findLastNodeOfType<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, sourceFile)).to.be.equal(undefined);
		});

		it('should return node', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile(
				'/main.ts',
				'function() {const a = 1; const b = 2;}',
				ts.ScriptTarget.Latest
			);

			const node = findLastNodeOfType<ts.Identifier>(ts.SyntaxKind.Identifier, sourceFile);

			expect(node.kind).to.be.equal(ts.SyntaxKind.Identifier);
			expect(node.text).to.be.equal('b');
		});

	});

});
