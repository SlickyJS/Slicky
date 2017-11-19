import {mockModuleResolutionHost, findNode} from '@slicky/typescript-api-utils';
import {createComponentMetadata, createDirectiveAnalyzer, createSourceFileFactory} from '../../helpers';
import * as ts from 'typescript';
import {expect} from 'chai';


const createSourceFile = createSourceFileFactory(['analyzers', 'directiveAnalyzer', 'component.styles']);


describe('#Analyzators/DirectiveAnalyzer.component.styles', () => {

	it('should throw an error when @Component.styles is not an array', () => {
		const sourceFile = createSourceFile('invalid_1');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(component);
		}).to.throw(Error, 'Component TestComponent: styles should be an array of string or simple require calls.');
	});

	it('should throw an error when @Component.styles is invalid array', () => {
		const sourceFile = createSourceFile('invalid_2');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(component);
		}).to.throw(Error, 'Component TestComponent: styles should be an array of string or simple require calls.');
	});

	it('should set component styles', () => {
		const sourceFile = createSourceFile('valid');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		const moduleResolutionHost = mockModuleResolutionHost({
			'/styles.css': 'body {background-color: blue}',
		});

		expect(createDirectiveAnalyzer(moduleResolutionHost).analyzeDirective(component)).to.be.eql({
			dependencies: [
				'/styles.css',
			],
			definition: createComponentMetadata({
				id: 'TestComponent_412123319',
				styles: [
					'body {color: red}',
					'body {background-color: blue}',
				],
			}),
		});
	});

});
