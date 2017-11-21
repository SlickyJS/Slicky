import {lookupSourceFile, findNode} from '../../../';
import {expect} from 'chai';
import * as ts from 'typescript';


describe('#sourceFiles/lookupSourceFile', () => {

	describe('lookupSourceFile()', () => {

		it('should throw an error if parent is not accessible', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile('/main.ts', '_(a)', ts.ScriptTarget.Latest);
			const node = findNode(ts.SyntaxKind.Identifier, 'a', sourceFile);

			expect(() => {
				lookupSourceFile(node);
			}).to.throw(Error, 'lookupSourceFile: can not get parent for Identifier node.');
		});

		it('should get source file for node', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile('/main.ts', '_(a)', ts.ScriptTarget.Latest, true);
			const node = findNode(ts.SyntaxKind.Identifier, 'a', sourceFile);

			expect(lookupSourceFile(node)).to.be.equal(sourceFile);
		});

	});

});
