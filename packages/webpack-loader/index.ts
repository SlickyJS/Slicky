import {Compiler} from '@slicky/compiler-cli';
import {CompiledTemplate} from '@slicky/compiler-cli/compiler';
import {exists, forEach} from '@slicky/utils';
import * as loaderUtils from 'loader-utils';
import * as ts from 'typescript';


export default function(source: string, sourcemap): string
{
	const options = loaderUtils.getOptions(this);

	if (!exists(options.configFileName)) {
		throw new Error('@slicky/webpack-loader: missing configFileName option');
	}

	const compiler = new Compiler(options.configFileName);

	if (!compiler.isProjectFile(this.resourcePath)) {
		return source;
	}

	const callback = this.async();

	compiler.compileFile(this.resourcePath, (templates) => {
		if (templates.length) {
			source = processFile(this.resourcePath, source, templates);
		}

		callback(null, source, sourcemap);
	});
}


function processFile(file: string, source: string, templates: Array<CompiledTemplate>): string
{
	const sourceFile = getSourceFile(file, source);

	forEach(templates, (template: CompiledTemplate) => {
		const templateSourceFile = getSourceFile('template.ts', template.template);
		const templateFunction = <ts.FunctionExpression>(<ts.ReturnStatement>templateSourceFile.statements[0]).expression;

		source = replaceTemplate(source, sourceFile, template, templateFunction);
	});

	return source;
}


function replaceTemplate(source: string, sourceFile: ts.SourceFile, template: CompiledTemplate, templateFunction: ts.FunctionExpression): string
{
	ts.forEachChild(sourceFile, (node: ts.ClassDeclaration) => {
		if (!ts.isClassDeclaration(node)) {
			return;
		}

		if (template.name !== node.name.escapedText) {
			return;
		}

		let componentDecorator: ts.Decorator = null;

		ts.forEachChild(node, (decorator: ts.Decorator) => {
			if (!ts.isDecorator(decorator)) {
				return;
			}

			if ((<ts.Identifier>(<ts.CallExpression>decorator.expression).expression).escapedText !== 'Component') {
				return;
			}

			componentDecorator = decorator;
		});

		if (!componentDecorator) {
			return;
		}

		const componentDecoratorArguments = [
			ts.createPropertyAssignment('id', ts.createNumericLiteral(template.id + '')),
		];

		let componentTemplate: ts.PropertyAssignment = null;

		ts.forEachChild((<ts.CallExpression>componentDecorator.expression).arguments[0], (propertyAssignment: ts.PropertyAssignment) => {
			if (!ts.isPropertyAssignment(propertyAssignment)) {
				return;
			}

			componentDecoratorArguments.push(propertyAssignment);

			if ((<ts.Identifier>propertyAssignment.name).escapedText !== 'template') {
				return;
			}

			componentTemplate = propertyAssignment;
		});

		if (!componentTemplate) {
			return;
		}

		componentTemplate.initializer = templateFunction;
		(<ts.CallExpression>componentDecorator.expression) = <ts.CallExpression>ts.createCall(
			ts.createIdentifier('Component'),
			undefined,
			[
				ts.createObjectLiteral(componentDecoratorArguments, true),
			]
		);

		const resultFile = ts.createSourceFile('component.ts', '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
		const printer = <ts.Printer>ts.createPrinter({
			newLine: ts.NewLineKind.LineFeed,
		});

		source = printer.printNode(ts.EmitHint.SourceFile, sourceFile, <ts.SourceFile>resultFile);
	});

	return source;
}


function getSourceFile(file: string, source: string): ts.SourceFile
{
	const program = ts.createProgram([file], {
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

	return (<ts.Program>program).getSourceFile(file);
}
