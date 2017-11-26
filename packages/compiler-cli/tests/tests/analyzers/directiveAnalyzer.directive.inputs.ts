import {findNode} from '@slicky/typescript-api-utils';
import {createDirectiveMetadata, createDirectiveAnalyzer, createSourceFileFactory} from '../../helpers';
import * as ts from 'typescript';
import {expect} from 'chai';


const createSourceFile = createSourceFileFactory(['analyzers', 'directiveAnalyzer', 'directive.inputs']);


describe('#Analyzators/DirectiveAnalyzer.directive.inputs', () => {

	it('should throw an error when @Input() has wrong argument', () => {
		const sourceFile = createSourceFile('invalid');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(directive);
		}).to.throw(Error, 'TestDirective.input: @Input() decorator should have no argument or string.');
	});

	it('should load inputs', () => {
		const sourceFile = createSourceFile('valid');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(createDirectiveAnalyzer().analyzeDirective(directive)).to.be.eql({
			dependencies: [],
			definition: createDirectiveMetadata({
				id: 'TestDirective_3669703671',
				inputs: [
					{
						name: 'input',
						property: 'input',
						required: false,
					},
					{
						name: 'custom-name-input',
						property: 'inputWithDifferentName',
						required: false,
					},
					{
						name: 'input-required',
						property: 'inputRequired',
						required: true,
					},
					{
						name: 'custom-name-required-input',
						property: 'inputRequiredWithDifferentName',
						required: true,
					},
				],
			}),
		});
	});

});
