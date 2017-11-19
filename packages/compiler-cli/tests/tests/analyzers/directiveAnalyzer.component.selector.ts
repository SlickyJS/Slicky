import {findNode} from '@slicky/typescript-api-utils';
import {createDirectiveAnalyzer, createSourceFileFactory} from '../../helpers';
import * as ts from 'typescript';
import {expect} from 'chai';


const createSourceFile = createSourceFileFactory(['analyzers', 'directiveAnalyzer', 'component.selector']);


describe('#Analyzators/DirectiveAnalyzer.component.selector', () => {

	it('should throw an error when @Component.name is missing', () => {
		const sourceFile = createSourceFile('invalid_1');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(component);
		}).to.throw(Error, 'Component TestComponent: missing selector.');
	});

	it('should throw an error when @Component.name is not valid', () => {
		const sourceFile = createSourceFile('invalid_2');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(component);
		}).to.throw(Error, 'Component TestComponent: selector should be a string.');
	});

	it('should throw an error when @Component.name is not valid string', () => {
		const sourceFile = createSourceFile('invalid_3');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(component);
		}).to.throw(Error, 'Component TestComponent: name should be a lowercased string with at least one dash.');
	});

});
