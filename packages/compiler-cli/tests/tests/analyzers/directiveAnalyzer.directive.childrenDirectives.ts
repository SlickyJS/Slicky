import {findNode} from '@slicky/typescript-api-utils';
import {createDirectiveMetadata, createDirectiveAnalyzer, createFilePathFactory, createSourceFileFactory} from '../../helpers';
import * as ts from 'typescript';
import {expect} from 'chai';


const createPath = createFilePathFactory(['analyzers', 'directiveAnalyzer', 'directive.childrenDirectives']);
const createSourceFile = createSourceFileFactory(['analyzers', 'directiveAnalyzer', 'directive.childrenDirectives']);


describe('#Analyzators/DirectiveAnalyzer.directive.childrenDirectives', () => {

	it('should throw an error when @ChildrenDirective() has no arguments', () => {
		const sourceFile = createSourceFile('invalid_1');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(directive);
		}).to.throw(Error, 'TestDirective.child: @ChildrenDirective() decorator should have identifier argument.');
	});

	it('should throw an error when @ChildrenDirective() has invalid arguments', () => {
		const sourceFile = createSourceFile('invalid_2');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(directive);
		}).to.throw(Error, 'TestDirective.child: @ChildrenDirective() decorator should have identifier argument.');
	});

	it('should compile children directives', () => {
		const sourceFile = createSourceFile('valid');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(createDirectiveAnalyzer().analyzeDirective(directive, true, false)).to.be.eql({
			dependencies: [],
			definition: createDirectiveMetadata({
				id: 'TestDirective_3669703671',
				childrenDirectives: [
					{
						property: 'children',
						directive: {
							localName: 'TestChildrenDirective',
							originalName: 'TestChildrenDirective',
							imported: false,
							path: createPath('valid'),
							node: undefined,
							metadata: createDirectiveMetadata({
								id: 'TestChildrenDirective_2962788058',
								className: 'TestChildrenDirective',
								selector: 'test-children-directive',
							}),
						},
					},
				],
			}),
		});
	});

});
