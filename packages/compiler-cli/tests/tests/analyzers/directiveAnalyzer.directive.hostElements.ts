import {findNode} from '@slicky/typescript-api-utils';
import {createDirectiveMetadata, createDirectiveAnalyzer, createSourceFileFactory} from '../../helpers';
import * as ts from 'typescript';
import {expect} from 'chai';


const createSourceFile = createSourceFileFactory(['analyzers', 'directiveAnalyzer', 'directive.hostElements']);


describe('#Analyzators/DirectiveAnalyzer.directive.hostElements', () => {

	it('should throw an error when @HostElement() has no arguments', () => {
		const sourceFile = createSourceFile('invalid_1');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(directive);
		}).to.throw(Error, 'TestDirective.el: @HostElement() decorator should have string selector argument.');
	});

	it('should throw an error when @HostElement() has wrong argument', () => {
		const sourceFile = createSourceFile('invalid_2');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(directive);
		}).to.throw(Error, 'TestDirective.el: @HostElement() decorator should have string selector argument.');
	});

	it('should load host elements', () => {
		const sourceFile = createSourceFile('valid');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(createDirectiveAnalyzer().analyzeDirective(directive)).to.be.eql({
			dependencies: [],
			definition: createDirectiveMetadata({
				id: 'TestDirective_3669703671',
				elements: [
					{
						property: 'el',
						selector: 'button',
						required: false,
					},
					{
						property: 'elRequired',
						selector: 'div',
						required: true,
					},
				],
			}),
		});
	});

});
