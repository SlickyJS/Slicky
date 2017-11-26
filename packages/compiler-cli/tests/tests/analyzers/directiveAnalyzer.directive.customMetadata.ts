import {findNode} from '@slicky/typescript-api-utils';
import {createDirectiveAnalyzer, createSourceFileFactory} from '../../helpers';
import * as ts from 'typescript';
import {expect} from 'chai';


const createSourceFile = createSourceFileFactory(['analyzers', 'directiveAnalyzer', 'directive.customMetadata']);


describe('#Analyzators/DirectiveAnalyzer.directive.customMetadata', () => {

	it('should analyze custom metadata', () => {
		const sourceFile = createSourceFile('valid_1');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		const analyzed = createDirectiveAnalyzer().analyzeDirective(directive);

		expect(analyzed.dependencies).to.be.eql([]);
		expect(analyzed.definition.customData.kind).to.be.equal(ts.SyntaxKind.StringLiteral);
		expect(analyzed.definition.customData.text).to.be.equal('hello world');
	});

});
