import {findNode} from '@slicky/typescript-api-utils';
import {createDirectiveMetadata, createDirectiveAnalyzer, createSourceFileFactory} from '../../helpers';
import * as ts from 'typescript';
import {expect} from 'chai';


const createSourceFile = createSourceFileFactory(['analyzers', 'directiveAnalyzer', 'directive.outputs']);


describe('#Analyzators/DirectiveAnalyzer.directive.outputs', () => {

	it('should throw an error when @Output() has wrong argument', () => {
		const sourceFile = createSourceFile('invalid');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(directive);
		}).to.throw(Error, 'TestDirective.output: @Output() decorator should have no argument or string.');
	});

	it('should load outputs', () => {
		const sourceFile = createSourceFile('valid');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(createDirectiveAnalyzer().analyzeDirective(directive)).to.be.eql({
			dependencies: [],
			definition: createDirectiveMetadata({
				id: 'TestDirective_3669703671',
				outputs: [
					{
						property: 'output',
						name: 'output',
					},
					{
						property: 'outputWithDifferentName',
						name: 'custom-name-output',
					},
				],
			}),
		});
	});

});
