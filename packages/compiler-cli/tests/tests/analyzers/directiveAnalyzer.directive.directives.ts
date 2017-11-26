import {findNode, fsModuleResolutionHost} from '@slicky/typescript-api-utils';
import {createDirectiveMetadata, createDirectiveAnalyzer, createSourceFileFactory} from '../../helpers';
import * as ts from 'typescript';
import {expect} from 'chai';


const createSourceFile = createSourceFileFactory(['analyzers', 'directiveAnalyzer', 'directive.directives']);


describe('#Analyzators/DirectiveAnalyzer.directive.directives', () => {

	it('should throw an error when @Directive.directives is not valid', () => {
		const sourceFile = createSourceFile('invalid_1');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(directive);
		}).to.throw(Error, 'Directive TestDirective: directives should be an array of identifiers.');
	});

	it('should throw an error when @Directive.directives is not valid array', () => {
		const sourceFile = createSourceFile('invalid_2');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(directive);
		}).to.throw(Error, 'Directive TestDirective: directives should be an array of identifiers.');
	});

	it('should throw an error when @Directive.directives is an array with not exported directive', () => {
		const sourceFile = createSourceFile('invalid_3');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(() => {
			createDirectiveAnalyzer(fsModuleResolutionHost()).analyzeDirective(directive);
		}).to.throw(Error, 'Directive TestDirective: can not use inner directive TestChildDirective, class is not exported.');
	});

	it('should analyze directive decorator with inner directives', () => {
		const sourceFile = createSourceFile('valid');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(createDirectiveAnalyzer().analyzeDirective(directive, true, false)).to.be.eql({
			dependencies: [],
			definition: createDirectiveMetadata({
				id: 'TestDirective_3669703671',
				directives: [
					{
						localName: 'TestChildDirective',
						originalName: 'TestChildDirective',
						imported: false,
						path: sourceFile.fileName,
						node: undefined,
						metadata: createDirectiveMetadata({
							id: 'TestChildDirective_680227610',
							className: 'TestChildDirective',
							selector: 'test-child-directive',
						}),
					},
				],
			}),
		});
	});

});
