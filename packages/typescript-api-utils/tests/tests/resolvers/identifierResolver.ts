import {resolveIdentifier, mockModuleResolutionHost} from '../../../';
import {expect} from 'chai';
import * as ts from 'typescript';


describe('#resolvers/identifierResolver', () => {

	describe('resolveIdentifier()', () => {

		it('should throw an error when identifier is without parent', () => {
			expect(() => {
				resolveIdentifier(<ts.Identifier>ts.createIdentifier('a'), {}, mockModuleResolutionHost());
			}).to.throw(Error, 'resolveIdentifier: Can not resolve identifier "a", identifier does not have a parent node.');
		});

		it('should resolve identifier from same file as variable declaration', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile(
				'/index.ts',
				(
					'const a = "hello world";\n' +
					'_(a);'
				),
				ts.ScriptTarget.Latest,
				true,
			);

			// "hello world"
			const initializer = <ts.StringLiteral>(<ts.VariableStatement>sourceFile.statements[0]).declarationList.declarations[0].initializer;

			// a
			const identifier = <ts.Identifier>(<ts.CallExpression>(<ts.ExpressionStatement>sourceFile.statements[1]).expression).arguments[0];

			const resolved = resolveIdentifier(identifier, {}, mockModuleResolutionHost());

			expect(resolved.dependencies).to.be.eql([]);
			expect(resolved.node).to.be.equal(initializer);
			expect(resolved.imported).to.be.equal(false);
			expect(resolved.originalName).to.be.equal('a');
			expect(resolved.sourceFile).to.be.equal(sourceFile);
		});

		it('should resolve identifier from same file as class declaration', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile(
				'/index.ts',
				(
					'class A {}\n' +
					'_(A);'
				),
				ts.ScriptTarget.Latest,
				true,
			);

			// class A {}
			const initializer = <ts.ClassDeclaration>sourceFile.statements[0];

			// A
			const identifier = <ts.Identifier>(<ts.CallExpression>(<ts.ExpressionStatement>sourceFile.statements[1]).expression).arguments[0];

			const resolved = resolveIdentifier(identifier, {}, mockModuleResolutionHost());

			expect(resolved.dependencies).to.be.eql([]);
			expect(resolved.node).to.be.equal(initializer);
			expect(resolved.imported).to.be.equal(false);
			expect(resolved.originalName).to.be.equal('A');
			expect(resolved.sourceFile).to.be.equal(sourceFile);
		});

		it('should resolve identifier from imported file', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile(
				'/index.ts',
				(
					'import {a} from "./a";\n' +
					'_(a);'
				),
				ts.ScriptTarget.Latest,
				true,
			);

			const moduleResolutionHost = mockModuleResolutionHost({
				'/a.ts': 'export const a = "hello world";',
			});

			// a
			const identifier = <ts.Identifier>(<ts.CallExpression>(<ts.ExpressionStatement>sourceFile.statements[1]).expression).arguments[0];

			const resolved = resolveIdentifier(identifier, {}, moduleResolutionHost);

			expect(resolved.originalName).to.be.equal('a');
			expect(resolved.imported).to.be.equal(true);
			expect(resolved.sourceFile.fileName).to.be.equal('/a.ts');
			expect(resolved.node.kind).to.be.equal(ts.SyntaxKind.StringLiteral);
			expect((<ts.StringLiteral>resolved.node).text).to.be.equal('hello world');
			expect(resolved.dependencies).to.be.eql([
				'/a.ts',
			]);
		});

		it('should resolve identifier from imported file with depth 3', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile(
				'/index.ts',
				(
					'import {a} from "./a1";\n' +
					'_(a);'
				),
				ts.ScriptTarget.Latest,
				true,
			);

			const moduleResolutionHost = mockModuleResolutionHost({
				'/a1.ts': 'export {a} from "./a2";',
				'/a2.ts': 'export {a} from "./a3";',
				'/a3.ts': 'export const a = "hello world";',
			});

			// a
			const identifier = <ts.Identifier>(<ts.CallExpression>(<ts.ExpressionStatement>sourceFile.statements[1]).expression).arguments[0];

			const resolved = resolveIdentifier(identifier, {}, moduleResolutionHost);

			expect(resolved.originalName).to.be.equal('a');
			expect(resolved.imported).to.be.equal(true);
			expect(resolved.sourceFile.fileName).to.be.equal('/a3.ts');
			expect(resolved.node.kind).to.be.equal(ts.SyntaxKind.StringLiteral);
			expect((<ts.StringLiteral>resolved.node).text).to.be.equal('hello world');
			expect(resolved.dependencies).to.be.eql([
				'/a1.ts',
				'/a2.ts',
				'/a3.ts',
			]);
		});

		it('should resolve identifier from imported and aliased file', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile(
				'/index.ts',
				(
					'import {a as b} from "./a";\n' +
					'_(b);'
				),
				ts.ScriptTarget.Latest,
				true,
			);

			const moduleResolutionHost = mockModuleResolutionHost({
				'/a.ts': 'export const a = "hello world";',
			});

			// b
			const identifier = <ts.Identifier>(<ts.CallExpression>(<ts.ExpressionStatement>sourceFile.statements[1]).expression).arguments[0];

			const resolved = resolveIdentifier(identifier, {}, moduleResolutionHost);

			expect(resolved.originalName).to.be.equal('a');
			expect(resolved.imported).to.be.equal(true);
			expect(resolved.sourceFile.fileName).to.be.equal('/a.ts');
			expect(resolved.node.kind).to.be.equal(ts.SyntaxKind.StringLiteral);
			expect((<ts.StringLiteral>resolved.node).text).to.be.equal('hello world');
			expect(resolved.dependencies).to.be.eql([
				'/a.ts',
			]);
		});

	});

});
