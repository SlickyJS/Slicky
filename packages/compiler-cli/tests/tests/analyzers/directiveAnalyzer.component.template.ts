import {mockModuleResolutionHost, findNode} from '@slicky/typescript-api-utils';
import {createComponentMetadata, createDirectiveAnalyzer, createSourceFileFactory} from '../../helpers';
import * as ts from 'typescript';
import {expect} from 'chai';


const createSourceFile = createSourceFileFactory(['analyzers', 'directiveAnalyzer', 'component.template']);


describe('#Analyzators/DirectiveAnalyzer.component.template', () => {

	it('should throw an error when @Component.template is missing', () => {
		const sourceFile = createSourceFile('invalid_1');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(component);
		}).to.throw(Error, 'Component TestComponent: missing template.');
	});

	it('should throw an error when @Component.template is not valid', () => {
		const sourceFile = createSourceFile('invalid_2');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(component);
		}).to.throw(Error, 'Component TestComponent: template should be a string, template string, arrow function, function expression or simple require call.');
	});

	it('should throw an error when @Component.template is using not require function', () => {
		const sourceFile = createSourceFile('invalid_3');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(component);
		}).to.throw(Error, 'Component TestComponent: template should be a simple require call.');
	});

	it('should throw an error when @Component.template is using require without arguments', () => {
		const sourceFile = createSourceFile('invalid_4');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(component);
		}).to.throw(Error, 'Component TestComponent: template should be a simple require call.');
	});

	it('should throw an error when @Component.template is using require with wrong argument', () => {
		const sourceFile = createSourceFile('invalid_5');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(component);
		}).to.throw(Error, 'Component TestComponent: template should be a simple require call.');
	});

	it('should throw an error when @Component.template is using require without file extension', () => {
		const sourceFile = createSourceFile('invalid_6');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(component);
		}).to.throw(Error, 'Component TestComponent: required template must have file extension.');
	});

	it('should throw an error when @Component.template is using require with not html extension', () => {
		const sourceFile = createSourceFile('invalid_7');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(() => {
			createDirectiveAnalyzer().analyzeDirective(component);
		}).to.throw(Error, 'Component TestComponent: required template must have file extension.');
	});

	it('should analyze component decorator with string template', () => {
		const sourceFile = createSourceFile('valid_1');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(createDirectiveAnalyzer().analyzeDirective(component)).to.be.eql({
			dependencies: [],
			definition: createComponentMetadata({
				id: 'TestComponent_544008761',
				template: 'hello world',
			}),
		});
	});

	it('should analyze component decorator with template from file', () => {
		const sourceFile = createSourceFile('valid_2');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		const moduleResolutionHost = mockModuleResolutionHost({
			'/template.html': 'hello world',
		});

		expect(createDirectiveAnalyzer(moduleResolutionHost).analyzeDirective(component)).to.be.eql({
			dependencies: [
				'/template.html',
			],
			definition: createComponentMetadata({
				id: 'TestComponent_913547418',
				template: 'hello world',
			}),
		});
	});

	it('should analyze component decorator with template in template string', () => {
		const sourceFile = createSourceFile('valid_3');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(createDirectiveAnalyzer().analyzeDirective(component)).to.be.eql({
			dependencies: [],
			definition: createComponentMetadata({
				id: 'TestComponent_3558690043',
				template: 'hello world',
			}),
		});
	});

	it('should analyze component decorator with template in variable in local file', () => {
		const sourceFile = createSourceFile('valid_4');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		expect(createDirectiveAnalyzer().analyzeDirective(component)).to.be.eql({
			dependencies: [],
			definition: createComponentMetadata({
				id: 'TestComponent_1955817308',
				template: 'hello world',
			}),
		});
	});

	it('should analyze component decorator with template in variable from imported file', () => {
		const sourceFile = createSourceFile('valid_5');
		const component = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'TestComponent', sourceFile);

		const moduleResolutionHost = mockModuleResolutionHost({
			'/template.ts': 'export const TEMPLATE = "hello world";',
		});

		expect(createDirectiveAnalyzer(moduleResolutionHost).analyzeDirective(component)).to.be.eql({
			dependencies: [
				'/template.ts',
			],
			definition: createComponentMetadata({
				id: 'TestComponent_373721789',
				template: 'hello world',
			}),
		});
	});

});
