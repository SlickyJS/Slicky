import {findNode} from '@slicky/typescript-api-utils';
import {createDirectiveMetadata, createDirectiveAnalyzer, createSourceFileFactory} from '../../helpers';
import * as ts from 'typescript';
import {expect} from 'chai';


const createSourceFile = createSourceFileFactory(['analyzers', 'directiveAnalyzer', 'directive.exportAs']);


describe('#Analyzators/DirectiveAnalyzer.directive.exportAs', () => {

	it('should throw an error when @Directive.exportAs is not valid', () => {
		const sourceFile = createSourceFile('invalid_1');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(directive);
		}).to.throw(Error, 'Directive TestDirective: exportAs should be a string or an array of strings.');
	});

	it('should throw an error when @Directive.exportAs array is not valid', () => {
		const sourceFile = createSourceFile('invalid_2');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(directive);
		}).to.throw(Error, 'Directive TestDirective: exportAs should be a string or an array of strings.');
	});

	it('should analyze directive decorator with exportAs as string', () => {
		const sourceFile = createSourceFile('valid_1');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(createDirectiveAnalyzer().analyzeDirective(directive)).to.be.eql({
			dependencies: [],
			definition: createDirectiveMetadata({
				id: 'TestDirective_1019046009',
				exportAs: ['dir'],
			}),
		});
	});

	it('should analyze directive decorator with exportAs as array', () => {
		const sourceFile = createSourceFile('valid_2');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(createDirectiveAnalyzer().analyzeDirective(directive)).to.be.eql({
			dependencies: [],
			definition: createDirectiveMetadata({
				id: 'TestDirective_797356250',
				exportAs: ['dirA', 'dirB'],
			}),
		});
	});

});
