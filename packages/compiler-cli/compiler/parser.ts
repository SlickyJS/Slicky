import {forEach, find, merge} from '@slicky/utils';
import {DirectiveDefinitionType} from '@slicky/core/metadata';
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import {WorkerWrapper, WorkerDirective} from './workerWrapper';


export declare interface ParsedComponent
{
	id: string,
	name: string,
	template: string,
}


export declare interface ParsedFile
{
	file: string,
	source: string,
	components: Array<ParsedComponent>,
}


export class Parser
{


	private worker: WorkerWrapper;

	private file: string;


	constructor(file: string)
	{
		this.worker = new WorkerWrapper;
		this.file = path.resolve(file);
	}


	public parse(done: (file: ParsedFile) => void): void
	{
		const source = fs.readFileSync(this.file, {encoding: 'utf8'});
		const sourceFile = this.getSourceFile(source);

		const classes: Array<ts.ClassDeclaration> = [];
		let components: Array<ParsedComponent> = [];
		let needDirectives = false;

		ts.forEachChild(sourceFile, (node) => {
			if (!ts.isClassDeclaration(node)) {
				return;
			}

			if (this.needDirectivesFromWorker(node)) {
				needDirectives = true;
				classes.push(node);
			}
		});

		if (!needDirectives) {
			done({
				file: this.file,
				source: source,
				components: components,
			});

			return;
		}

		this.worker.processFile(this.file, (directives) => {
			forEach(classes, (classDeclaration: ts.ClassDeclaration) => {
				const name = classDeclaration.name.escapedText;
				const directive = <WorkerDirective>find(directives, (directive: WorkerDirective) => {
					return directive.name === name;
				});

				if (!directive) {
					return;
				}

				components = merge(components, this.processDirective(classDeclaration, directive));
			});

			done({
				file: this.file,
				source: this.stringifySourceFile(sourceFile),
				components: components,
			});
		});
	}


	private processDirective(directiveClass: ts.ClassDeclaration, directive: WorkerDirective): Array<ParsedComponent>
	{
		const components: Array<ParsedComponent> = [];

		const directiveDecorator = directive.type === DirectiveDefinitionType.Directive ?
			this.findDecoratorWithName(directiveClass, 'Directive') :
			this.findDecoratorWithName(directiveClass, 'Component')
		;

		const newArguments: Array<ts.PropertyAssignment> = [];

		if (!this.findPropertyAssignmentExpressionInDecorator(directiveDecorator, 'id')) {
			newArguments.push(ts.createPropertyAssignment('id', ts.createLiteral(directive.id)));
		}

		this.eachPropertyAssignmentInDecorator(directiveDecorator, (name, property) => {
			if (name === 'template' && directive.type === DirectiveDefinitionType.Component && directive.template) {
				const templateSourceFile = this.getSourceFile(directive.template);
				const templateFunction = <ts.FunctionExpression>(<ts.ReturnStatement>templateSourceFile.statements[0]).expression;

				property.initializer = templateFunction;

				components.push({
					id: directive.id,
					name: directive.name,
					template: directive.template,
				});
			}

			newArguments.push(property);
		});

		directiveDecorator.expression = <ts.CallExpression>ts.createCall(
			ts.createIdentifier(directive.type === DirectiveDefinitionType.Directive ? 'Directive' : 'Component'),
			undefined,
			[
				ts.createObjectLiteral(newArguments, true),
			]
		);

		return components;
	}


	private needDirectivesFromWorker(classDeclaration: ts.ClassDeclaration): boolean
	{
		let directive = this.findDecoratorWithName(classDeclaration, 'Directive');
		let isComponent = false;

		if (!directive) {
			directive = this.findDecoratorWithName(classDeclaration, 'Component');
			isComponent = true;
		}

		if (!directive) {
			return false;
		}

		if (isComponent) {
			return true;
		}

		if (!this.findPropertyAssignmentExpressionInDecorator(directive, 'id')) {
			return true;
		}

		return false;
	}


	private eachPropertyAssignmentInDecorator(decorator: ts.Decorator, iterator: (name: string, initializer: ts.PropertyAssignment) => void): void
	{
		ts.forEachChild((<ts.CallExpression>decorator.expression).arguments[0], (propertyAssignment: ts.PropertyAssignment) => {
			if (!ts.isPropertyAssignment(propertyAssignment)) {
				return;
			}

			iterator((<ts.Identifier>propertyAssignment.name).escapedText.toString(), propertyAssignment);
		});
	}


	private findPropertyAssignmentExpressionInDecorator(decorator: ts.Decorator, name: string): ts.PropertyAssignment
	{
		let found: ts.PropertyAssignment;

		this.eachPropertyAssignmentInDecorator(decorator, (decoratorName, initializer) => {
			if (decoratorName === name) {
				found = initializer;
			}
		});

		return found;
	}


	private findDecoratorWithName(classDeclaration: ts.ClassDeclaration, name: string): ts.Decorator
	{
		let found: ts.Decorator;

		ts.forEachChild(classDeclaration, (decorator: ts.Decorator) => {
			if (!ts.isDecorator(decorator)) {
				return;
			}

			if ((<ts.Identifier>(<ts.CallExpression>decorator.expression).expression).escapedText !== name) {
				return;
			}

			found = decorator;
		});

		return found;
	}


	private stringifySourceFile(sourceFile: ts.SourceFile): string
	{
		const resultFile = ts.createSourceFile('component.ts', '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
		const printer = ts.createPrinter({
			newLine: ts.NewLineKind.LineFeed,
		});

		return printer.printNode(ts.EmitHint.SourceFile, sourceFile, resultFile);
	}


	private getSourceFile(source: string): ts.SourceFile
	{
		const program = ts.createProgram(['source.ts'], {
			noResolve: true,
			target: ts.ScriptTarget.Latest,
			experimentalDecorators: true,
			experimentalAsyncFunctions: true,
		}, {
			fileExists: () => true,
			getCanonicalFileName: (filename) => filename,
			getCurrentDirectory: () => '',
			getDirectories: () => [],
			getDefaultLibFileName: () => 'lib.d.ts',
			getNewLine: () => '\n',
			getSourceFile: (filename) => ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, false),
			readFile: () => null,
			useCaseSensitiveFileNames: () => true,
			writeFile: () => null,
		});

		return (<ts.Program>program).getSourceFile('source.ts');
	}

}
