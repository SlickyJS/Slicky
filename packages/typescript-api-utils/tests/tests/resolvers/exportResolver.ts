import {resolveExport, mockModuleResolutionHost} from '../../../';
import {expect} from 'chai';
import * as ts from 'typescript';


describe('#resolvers/exportResolver', () => {

	describe('resolveExport()', () => {

		it('should not resolve node', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile('/index.ts', '', ts.ScriptTarget.Latest);

			expect(resolveExport('a', sourceFile, {}, mockModuleResolutionHost())).to.be.equal(undefined);
		});

		it('should not resolve not exported node', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile('/index.ts', 'const a = "hello world";', ts.ScriptTarget.Latest);

			expect(resolveExport('a', sourceFile, {}, mockModuleResolutionHost())).to.be.equal(undefined);
		});

		it('should resolve exported variable declaration', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile('/index.ts', 'export const a = "hello world";', ts.ScriptTarget.Latest);

			// "hello world"
			const initializer = <ts.StringLiteral>(<ts.VariableStatement>sourceFile.statements[0]).declarationList.declarations[0].initializer;

			const resolved = resolveExport('a', sourceFile, {}, mockModuleResolutionHost());

			expect(resolved.dependencies).to.be.eql([]);
			expect(resolved.node).to.be.equal(initializer);
			expect(resolved.originalName).to.be.equal('a');
			expect(resolved.imported).to.be.equal(false);
			expect(resolved.sourceFile).to.be.equal(sourceFile);
		});

		it('should resolve exported variable declaration from imported file', () => {
			const moduleResolutionHost = mockModuleResolutionHost({
				'/a.ts': 'export const a = "hello world";',
			});

			const sourceFile = <ts.SourceFile>ts.createSourceFile('/index.ts', 'export {a} from "./a";', ts.ScriptTarget.Latest);
			const resolvedExport = resolveExport('a', sourceFile, {}, moduleResolutionHost);

			expect(resolvedExport.originalName).to.be.equal('a');
			expect(resolvedExport.imported).to.be.equal(true);
			expect(resolvedExport.sourceFile.fileName).to.be.equal('/a.ts');
			expect(resolvedExport.node.kind).to.be.equal(ts.SyntaxKind.StringLiteral);
			expect((<ts.StringLiteral>resolvedExport.node).text).to.be.equal('hello world');
			expect(resolvedExport.dependencies).to.be.eql([
				'/a.ts',
			]);
		});

		it('should resolve exported variable declaration from imported file with depth 3', () => {
			const moduleResolutionHost = mockModuleResolutionHost({
				'/a1.ts': 'export {a} from "./a2";',
				'/a2.ts': 'export {a} from "./a3";',
				'/a3.ts': 'export const a = "hello world";',
			});

			const sourceFile = <ts.SourceFile>ts.createSourceFile('/index.ts', 'export {a} from "./a1";', ts.ScriptTarget.Latest);
			const resolvedExport = resolveExport('a', sourceFile, {}, moduleResolutionHost);

			expect(resolvedExport.originalName).to.be.equal('a');
			expect(resolvedExport.imported).to.be.equal(true);
			expect(resolvedExport.sourceFile.fileName).to.be.equal('/a3.ts');
			expect(resolvedExport.node.kind).to.be.equal(ts.SyntaxKind.StringLiteral);
			expect((<ts.StringLiteral>resolvedExport.node).text).to.be.equal('hello world');
			expect(resolvedExport.dependencies).to.be.eql([
				'/a1.ts',
				'/a2.ts',
				'/a3.ts',
			]);
		});

		it('should resolve exported and aliased variable declaration from imported file with depth 3', () => {
			const moduleResolutionHost = mockModuleResolutionHost({
				'/a1.ts': 'export {a1 as a2} from "./a2";',
				'/a2.ts': 'export {a as a1} from "./a3";',
				'/a3.ts': 'export const a = "hello world";',
			});

			const sourceFile = <ts.SourceFile>ts.createSourceFile('/index.ts', 'export {a2 as a3} from "./a1";', ts.ScriptTarget.Latest);
			const resolvedExport = resolveExport('a3', sourceFile, {}, moduleResolutionHost);

			expect(resolvedExport.originalName).to.be.equal('a');
			expect(resolvedExport.imported).to.be.equal(true);
			expect(resolvedExport.sourceFile.fileName).to.be.equal('/a3.ts');
			expect(resolvedExport.node.kind).to.be.equal(ts.SyntaxKind.StringLiteral);
			expect((<ts.StringLiteral>resolvedExport.node).text).to.be.equal('hello world');
			expect(resolvedExport.dependencies).to.be.eql([
				'/a1.ts',
				'/a2.ts',
				'/a3.ts',
			]);
		});

		it('should resolve exported variable declaration from imported file with depth 3 and export all', () => {
			const moduleResolutionHost = mockModuleResolutionHost({
				'/a1.ts': 'export * from "./a2";',
				'/a2.ts': 'export * from "./a3";',
				'/a3.ts': 'export const a = "hello world";',
			});

			const sourceFile = <ts.SourceFile>ts.createSourceFile('/index.ts', 'export * from "./a1";', ts.ScriptTarget.Latest);
			const resolvedExport = resolveExport('a', sourceFile, {}, moduleResolutionHost);

			expect(resolvedExport.originalName).to.be.equal('a');
			expect(resolvedExport.imported).to.be.equal(true);
			expect(resolvedExport.sourceFile.fileName).to.be.equal('/a3.ts');
			expect(resolvedExport.node.kind).to.be.equal(ts.SyntaxKind.StringLiteral);
			expect((<ts.StringLiteral>resolvedExport.node).text).to.be.equal('hello world');
			expect(resolvedExport.dependencies).to.be.eql([
				'/a1.ts',
				'/a2.ts',
				'/a3.ts',
			]);
		});

	});

});
