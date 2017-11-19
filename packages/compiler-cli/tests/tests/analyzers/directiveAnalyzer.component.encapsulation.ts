import {findNode} from '@slicky/typescript-api-utils';
import {TemplateEncapsulation} from '@slicky/templates/templates';
import {createComponentMetadata, createDirectiveAnalyzer, createSourceFileFactory} from '../../helpers';
import * as ts from 'typescript';
import {expect} from 'chai';


const createSourceFile = createSourceFileFactory(['analyzers', 'directiveAnalyzer', 'component.encapsulation']);


describe('#Analyzators/DirectiveAnalyzer.component.encapsulation', () => {

	it('should throw an error when @Component.encapsulation is not valid #1', () => {
		const sourceFile = createSourceFile('invalid_1');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(component);
		}).to.throw(Error, 'Component TestComponent: encapsulation should be one of: TemplateEncapsulation.None, TemplateEncapsulation.Emulated or TemplateEncapsulation.Native.');
	});

	it('should throw an error when @Component.encapsulation is not valid #2', () => {
		const sourceFile = createSourceFile('invalid_2');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(component);
		}).to.throw(Error, 'Component TestComponent: encapsulation should be one of: TemplateEncapsulation.None, TemplateEncapsulation.Emulated or TemplateEncapsulation.Native.');
	});

	it('should throw an error when @Component.encapsulation is not valid #3', () => {
		const sourceFile = createSourceFile('invalid_3');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(component);
		}).to.throw(Error, 'Component TestComponent: encapsulation should be one of: TemplateEncapsulation.None, TemplateEncapsulation.Emulated or TemplateEncapsulation.Native.');
	});

	it('should throw an error when @Component.encapsulation is unknown 3', () => {
		const sourceFile = createSourceFile('invalid_4');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(component);
		}).to.throw(Error, 'Component TestComponent: encapsulation should be one of: TemplateEncapsulation.None, TemplateEncapsulation.Emulated or TemplateEncapsulation.Native.');
	});

	it('should analyze component decorator with encapsulation', () => {
		const sourceFile = createSourceFile('valid');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(createDirectiveAnalyzer().analyzeDirective(component)).to.be.eql({
			dependencies: [],
			definition: createComponentMetadata({
				id: 'TestComponent_412123319',
				encapsulation: TemplateEncapsulation.None,
			}),
		});
	});

});
