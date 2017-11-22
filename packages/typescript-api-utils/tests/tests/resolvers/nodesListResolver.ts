import {resolveIdentifierAsFlatNodesList, mockModuleResolutionHost} from '../../../';
import {expect} from 'chai';
import * as ts from 'typescript';


describe('#resolvers/nodesListResolver', () => {

	describe('resolveIdentifierAsFlatNodesList()', () => {

		it('should return empty array', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile('/index.ts', '_(a)', ts.ScriptTarget.Latest, true);

			// a
			const identifier = <ts.Identifier>(<ts.CallExpression>(<ts.ExpressionStatement>sourceFile.statements[0]).expression).arguments[0];

			expect(resolveIdentifierAsFlatNodesList(identifier, {}, mockModuleResolutionHost())).to.be.eql({
				dependencies: [],
				nodes: [],
			});
		});

		it('should return array with one element if resolved node is not an array', () => {
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

			expect(resolveIdentifierAsFlatNodesList(identifier, {}, mockModuleResolutionHost())).to.be.eql({
				dependencies: [],
				nodes: [
					{
						dependencies: [],
						node: initializer,
						originalName: 'a',
						imported: false,
						sourceFile: sourceFile,
					},
				],
			});
		});

		it('should return array with resolved direct inner nodes', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile(
				'/index.ts',
				(
					'const a = ["a", "b", "c"];\n' +
					'_(a);'
				),
				ts.ScriptTarget.Latest,
				true,
			);

			// a
			const identifier = <ts.Identifier>(<ts.CallExpression>(<ts.ExpressionStatement>sourceFile.statements[1]).expression).arguments[0];

			const resolvedList = resolveIdentifierAsFlatNodesList(identifier, {}, mockModuleResolutionHost());

			expect(resolvedList.dependencies).to.have.length(0);
			expect(resolvedList.nodes).to.have.length(3);
			expect(resolvedList.nodes[0].originalName).to.be.equal('a');
			expect(resolvedList.nodes[1].originalName).to.be.equal('a');
			expect(resolvedList.nodes[2].originalName).to.be.equal('a');
			expect(resolvedList.nodes[0].node.kind).to.be.equal(ts.SyntaxKind.StringLiteral);
			expect(resolvedList.nodes[1].node.kind).to.be.equal(ts.SyntaxKind.StringLiteral);
			expect(resolvedList.nodes[2].node.kind).to.be.equal(ts.SyntaxKind.StringLiteral);
			expect((<ts.StringLiteral>resolvedList.nodes[0].node).text).to.be.equal('a');
			expect((<ts.StringLiteral>resolvedList.nodes[1].node).text).to.be.equal('b');
			expect((<ts.StringLiteral>resolvedList.nodes[2].node).text).to.be.equal('c');
		});

		it('should return array with resolved inner nodes from same file', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile(
				'/index.ts',
				(
					'const a1 = "a";\n' +
					'const a2 = "b";\n' +
					'const a3 = "c";\n' +
					'const a = [a1, a2, a3];\n' +
					'_(a);'
				),
				ts.ScriptTarget.Latest,
				true,
			);

			// a
			const identifier = <ts.Identifier>(<ts.CallExpression>(<ts.ExpressionStatement>sourceFile.statements[4]).expression).arguments[0];

			const resolvedList = resolveIdentifierAsFlatNodesList(identifier, {}, mockModuleResolutionHost());

			expect(resolvedList.dependencies).to.have.length(0);
			expect(resolvedList.nodes).to.have.length(3);
			expect(resolvedList.nodes[0].originalName).to.be.equal('a1');
			expect(resolvedList.nodes[1].originalName).to.be.equal('a2');
			expect(resolvedList.nodes[2].originalName).to.be.equal('a3');
			expect(resolvedList.nodes[0].node.kind).to.be.equal(ts.SyntaxKind.StringLiteral);
			expect(resolvedList.nodes[1].node.kind).to.be.equal(ts.SyntaxKind.StringLiteral);
			expect(resolvedList.nodes[2].node.kind).to.be.equal(ts.SyntaxKind.StringLiteral);
			expect((<ts.StringLiteral>resolvedList.nodes[0].node).text).to.be.equal('a');
			expect((<ts.StringLiteral>resolvedList.nodes[1].node).text).to.be.equal('b');
			expect((<ts.StringLiteral>resolvedList.nodes[2].node).text).to.be.equal('c');
		});

		it('should return array with resolved inner nodes from imported file', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile(
				'/index.ts',
				(
					'import {a1} from "./a1";' +
					'import {a2} from "./a2";' +
					'import {a3} from "./a3";' +
					'const a = [a1, a2, a3];\n' +
					'_(a);'
				),
				ts.ScriptTarget.Latest,
				true,
			);

			const moduleResolutionHost = mockModuleResolutionHost({
				'/a1.ts': 'export const a1 = "a";',
				'/a2.ts': 'export const a2 = "b";',
				'/a3.ts': 'export const a3 = "c";',
			});

			// a
			const identifier = <ts.Identifier>(<ts.CallExpression>(<ts.ExpressionStatement>sourceFile.statements[4]).expression).arguments[0];

			const resolvedList = resolveIdentifierAsFlatNodesList(identifier, {}, moduleResolutionHost);

			expect(resolvedList.nodes).to.have.length(3);
			expect(resolvedList.nodes[0].originalName).to.be.equal('a1');
			expect(resolvedList.nodes[1].originalName).to.be.equal('a2');
			expect(resolvedList.nodes[2].originalName).to.be.equal('a3');
			expect(resolvedList.nodes[0].sourceFile.fileName).to.be.equal('/a1.ts');
			expect(resolvedList.nodes[1].sourceFile.fileName).to.be.equal('/a2.ts');
			expect(resolvedList.nodes[2].sourceFile.fileName).to.be.equal('/a3.ts');
			expect(resolvedList.nodes[0].node.kind).to.be.equal(ts.SyntaxKind.StringLiteral);
			expect(resolvedList.nodes[1].node.kind).to.be.equal(ts.SyntaxKind.StringLiteral);
			expect(resolvedList.nodes[2].node.kind).to.be.equal(ts.SyntaxKind.StringLiteral);
			expect((<ts.StringLiteral>resolvedList.nodes[0].node).text).to.be.equal('a');
			expect((<ts.StringLiteral>resolvedList.nodes[1].node).text).to.be.equal('b');
			expect((<ts.StringLiteral>resolvedList.nodes[2].node).text).to.be.equal('c');
			expect(resolvedList.dependencies).to.be.eql([
				'/a1.ts',
				'/a2.ts',
				'/a3.ts',
			]);
		});

		it('should return array with resolved inner nodes from multidimensional array', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile(
				'/index.ts',
				(
					'const a1 = ["a"];' +
					'const a2 = ["b"];' +
					'const a3 = ["c"];' +
					'const a = [a1, a2, a3];\n' +
					'_(a);'
				),
				ts.ScriptTarget.Latest,
				true,
			);

			// a
			const identifier = <ts.Identifier>(<ts.CallExpression>(<ts.ExpressionStatement>sourceFile.statements[4]).expression).arguments[0];

			const resolvedList = resolveIdentifierAsFlatNodesList(identifier, {}, mockModuleResolutionHost());

			expect(resolvedList.dependencies).to.have.length(0);
			expect(resolvedList.nodes).to.have.length(3);
			expect(resolvedList.nodes[0].originalName).to.be.equal('a1');
			expect(resolvedList.nodes[1].originalName).to.be.equal('a2');
			expect(resolvedList.nodes[2].originalName).to.be.equal('a3');
			expect(resolvedList.nodes[0].node.kind).to.be.equal(ts.SyntaxKind.StringLiteral);
			expect(resolvedList.nodes[1].node.kind).to.be.equal(ts.SyntaxKind.StringLiteral);
			expect(resolvedList.nodes[2].node.kind).to.be.equal(ts.SyntaxKind.StringLiteral);
			expect((<ts.StringLiteral>resolvedList.nodes[0].node).text).to.be.equal('a');
			expect((<ts.StringLiteral>resolvedList.nodes[1].node).text).to.be.equal('b');
			expect((<ts.StringLiteral>resolvedList.nodes[2].node).text).to.be.equal('c');
		});

	});

});
