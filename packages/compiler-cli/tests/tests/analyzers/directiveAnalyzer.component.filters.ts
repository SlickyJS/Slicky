import {findNode} from '@slicky/typescript-api-utils';
import {createComponentMetadata, createDirectiveAnalyzer, createSourceFileFactory} from '../../helpers';
import * as ts from 'typescript';
import {expect} from 'chai';


const createSourceFile = createSourceFileFactory(['analyzers', 'directiveAnalyzer', 'component.filters']);


describe('#Analyzators/DirectiveAnalyzer.component.filters', () => {

	it('should throw an error when @Component.filters is not valid', () => {
		const sourceFile = createSourceFile('invalid_1');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(component);
		}).to.throw(Error, 'Component TestComponent: filters should be an array of identifiers.');
	});

	it('should throw an error when @Component.filters is not valid array', () => {
		const sourceFile = createSourceFile('invalid_2');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(component);
		}).to.throw(Error, 'Component TestComponent: filters should be an array of identifiers.');
	});

	it('should parse filters', () => {
		const sourceFile = createSourceFile('valid');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(createDirectiveAnalyzer().analyzeDirective(component)).to.be.eql({
			dependencies: [],
			definition: createComponentMetadata({
				id: 'TestComponent_412123319',
				filters: [
					{
						localName: 'TestFilter',
						originalName: 'TestFilter',
						imported: false,
						path: sourceFile.fileName,
						metadata: {
							className: 'TestFilter',
							name: 'test-filter',
						},
					},
				],
			}),
		});
	});

});
