import {findNode} from '../../../';
import {expect} from 'chai';
import * as ts from 'typescript';


describe('#sourceFiles/findNode', () => {

	describe('findNode()', () => {

		it('should return undefined if node does not exists', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile('/main.ts', '', ts.ScriptTarget.Latest);

			expect(findNode(ts.SyntaxKind.ClassDeclaration, 'TestClass', sourceFile)).to.be.equal(undefined);
		});

		it('should return node', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile('/main.ts', 'function() {const a = "hello world";}', ts.ScriptTarget.Latest);
			const node = findNode(ts.SyntaxKind.Identifier, 'a', sourceFile);

			expect(node.kind).to.be.equal(ts.SyntaxKind.Identifier);
		});

	});

});
