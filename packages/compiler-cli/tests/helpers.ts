import {exists, clone} from '@slicky/utils';
import {DirectiveDefinition, createDirectiveMetadata as _createDirectiveMetadata, createComponentMetadata as _createComponentMetadata} from '@slicky/core/metadata';
import {mockModuleResolutionHost} from '@slicky/typescript-api-utils';
import {FilterAnalyzer, DirectiveAnalyzer, FileAnalyzer} from '../analyzers';
import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';


export function createDirectiveMetadata(partialMetadata: any = {}): DirectiveDefinition
{
	partialMetadata.id = exists(partialMetadata.id) ? partialMetadata.id : 'TestDirective';
	partialMetadata.className = exists(partialMetadata.className) ? partialMetadata.className : 'TestDirective';
	partialMetadata.selector = exists(partialMetadata.selector) ? partialMetadata.selector : 'test-directive';

	return _createDirectiveMetadata(partialMetadata);
}


export function createComponentMetadata(partialMetadata: any = {}): DirectiveDefinition
{
	partialMetadata.id = exists(partialMetadata.id) ? partialMetadata.id : 'TestComponent';
	partialMetadata.className = exists(partialMetadata.className) ? partialMetadata.className : 'TestComponent';
	partialMetadata.selector = exists(partialMetadata.selector) ? partialMetadata.selector : 'test-component';
	partialMetadata.template = exists(partialMetadata.template) ? partialMetadata.template : '';

	return _createComponentMetadata(partialMetadata);
}


export function createDirectiveAnalyzer(moduleResolutionHost: ts.ModuleResolutionHost = mockModuleResolutionHost()): DirectiveAnalyzer
{
	return new DirectiveAnalyzer(new FilterAnalyzer, {}, moduleResolutionHost);
}


export function createFileAnalyzer(moduleResolutionHost: ts.ModuleResolutionHost = mockModuleResolutionHost()): FileAnalyzer
{
	const filterAnalyzer = new FilterAnalyzer;
	const directiveAnalyzer = new DirectiveAnalyzer(filterAnalyzer, {}, moduleResolutionHost);

	return new FileAnalyzer(directiveAnalyzer, filterAnalyzer);
}


export function createFilePathFactory(pathParts: Array<string>): (name: string) => string
{
	const parts = clone(pathParts);

	parts.unshift(__dirname, 'data');

	return (name: string): string => {
		return path.join(...parts, `${name}.ts`);
	};
}


export function createFileFactory(pathParts: Array<string>): (name: string) => string
{
	const pathProvider = createFilePathFactory(pathParts);

	return (name: string): string => {
		return <string>fs.readFileSync(pathProvider(name), {encoding: 'utf8'});
	};
}


export function createSourceFileFactory(pathParts: Array<string>): (name: string) => ts.SourceFile
{
	const pathProvider = createFilePathFactory(pathParts);
	const fileProvider = createFileFactory(pathParts);

	return (name: string): ts.SourceFile => {
		const filePath = pathProvider(name);
		const file = fileProvider(name);

		return <ts.SourceFile>ts.createSourceFile(filePath, file, ts.ScriptTarget.Latest, true);
	};
}


export function createTransformationResult(sourceFile: ts.SourceFile, transformers: Array<ts.TransformerFactory<ts.SourceFile>>): ts.TransformationResult<ts.SourceFile>
{
	return <ts.TransformationResult<ts.SourceFile>>ts.transform(sourceFile, transformers);
}
