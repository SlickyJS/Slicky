import {findNode} from '@slicky/typescript-api-utils';
import {createDirectiveMetadata, createDirectiveAnalyzer, createSourceFileFactory, createFilePathFactory} from '../../helpers';
import * as ts from 'typescript';
import {expect} from 'chai';


const createPath = createFilePathFactory(['analyzers', 'directiveAnalyzer', 'directive.childDirectives']);
const createSourceFile = createSourceFileFactory(['analyzers', 'directiveAnalyzer', 'directive.childDirectives']);


describe('#Analyzators/DirectiveAnalyzer.directive.childDirectives', () => {

	it('should throw an error when @ChildDirective() has no arguments', () => {
		const sourceFile = createSourceFile('invalid_1');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(directive);
		}).to.throw(Error, 'TestDirective.child: @ChildDirective() decorator should have identifier argument.');
	});

	it('should throw an error when @ChildDirective() has invalid arguments', () => {
		const sourceFile = createSourceFile('invalid_2');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(directive);
		}).to.throw(Error, 'TestDirective.child: @ChildDirective() decorator should have identifier argument.');
	});

	it('should compile child directives', () => {
		const sourceFile = createSourceFile('valid');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(createDirectiveAnalyzer().analyzeDirective(directive, true, false)).to.be.eql({
			dependencies: [],
			definition: createDirectiveMetadata({
				id: 'TestDirective_3669703671',
				childDirectives: [
					{
						property: 'child',
						required: false,
						directive: {
							localName: 'TestChildDirective',
							originalName: 'TestChildDirective',
							imported: false,
							path: createPath('valid'),
							node: undefined,
							metadata: createDirectiveMetadata({
								id: 'TestChildDirective_680227610',
								className: 'TestChildDirective',
								selector: 'test-child-directive',
							}),
						},
					},
					{
						property: 'childRequired',
						required: true,
						directive: {
							localName: 'TestChildDirective',
							originalName: 'TestChildDirective',
							imported: false,
							path: createPath('valid'),
							node: undefined,
							metadata: createDirectiveMetadata({
								id: 'TestChildDirective_680227610',
								className: 'TestChildDirective',
								selector: 'test-child-directive',
							}),
						},
					},
				],
			}),
		});
	});

});
