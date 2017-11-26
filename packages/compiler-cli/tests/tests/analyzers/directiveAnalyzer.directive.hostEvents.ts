import {findNode} from '@slicky/typescript-api-utils';
import {createDirectiveMetadata, createDirectiveAnalyzer, createSourceFileFactory} from '../../helpers';
import * as ts from 'typescript';
import {expect} from 'chai';


const createSourceFile = createSourceFileFactory(['analyzers', 'directiveAnalyzer', 'directive.hostEvents']);


describe('#Analyzators/DirectiveAnalyzer.directive.hostEvents', () => {

	it('should throw an error when @HostEvent() has no arguments', () => {
		const sourceFile = createSourceFile('invalid_1');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(directive);
		}).to.throw(Error, 'TestDirective.onClick: @HostEvent() decorator should have string event name argument.');
	});

	it('should throw an error when @HostEvent() has wrong event argument', () => {
		const sourceFile = createSourceFile('invalid_2');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(directive);
		}).to.throw(Error, 'TestDirective.onClick: @HostEvent() decorator should have string event name argument.');
	});

	it('should throw an error when @HostEvent() has wrong selector argument', () => {
		const sourceFile = createSourceFile('invalid_3');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(directive);
		}).to.throw(Error, 'TestDirective.onClick: @HostEvent() decorator should have string event name argument.');
	});

	it('should throw an error when @HostEvent depends on unknown @HostElement', () => {
		const sourceFile = createSourceFile('invalid_4');
		const directive = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestDirective', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(directive);
		}).to.throw(Error, 'TestDirective.onClick: @HostEvent() requires unknown @HostElement() on TestDirective.btn.');
	});

	it('should load host events', () => {
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
				],
				events: [
					{
						method: 'onEvent',
						event: 'click',
					},
					{
						method: 'onEventWithSelector',
						event: 'click',
						selector: 'div',
					},
					{
						method: 'onEventWithHostElement',
						event: 'click',
						selector: 'button',
					},
				],
			}),
		});
	});

});
