import {findNode} from '@slicky/typescript-api-utils';
import {createDirectiveMetadata, createDirectiveAnalyzer, createSourceFileFactory} from '../../helpers';
import * as ts from 'typescript';
import {expect} from 'chai';


const createSourceFile = createSourceFileFactory(['analyzers', 'directiveAnalyzer', 'directive.override']);


describe('#Analyzators/DirectiveAnalyzer.directive.override', () => {

	it('should throw an error when @Directive.override is not valid', () => {
		const sourceFile = createSourceFile('invalid');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(directive);
		}).to.throw(Error, 'Directive TestDirective: override should be an identifier.');
	});

	it('should analyze directive decorator with override', () => {
		const sourceFile = createSourceFile('valid');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(createDirectiveAnalyzer().analyzeDirective(directive, true, false)).to.be.eql({
			dependencies: [],
			definition: createDirectiveMetadata({
				id: 'TestDirective_3669703671',
				override: {
					localName: 'TestBaseDirective',
					originalName: 'TestBaseDirective',
					imported: false,
					path: sourceFile.fileName,
					node: undefined,
					metadata: createDirectiveMetadata({
						id: 'TestBaseDirective_2586426242',
						className: 'TestBaseDirective',
					}),
				},
			}),
		});
	});

});
