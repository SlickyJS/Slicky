import {exists, merge} from '@slicky/utils';
import {resolveRequire} from './requireResolver';
import {resolveExport} from './exportResolver';
import {_checkAndExtractNodeName} from './_utils';
import * as ts from 'typescript';


export declare interface ResolvedIdentifier<T extends ts.Node>
{
	dependencies: Array<string>,
	node: T,
	originalName: string,
	sourceFile?: ts.SourceFile,
}


export function resolveIdentifier<T extends ts.Node>(identifier: ts.Identifier, compilerOptions: ts.CompilerOptions, moduleResolutionHost: ts.ModuleResolutionHost): ResolvedIdentifier<T>|undefined
{
	if (!exists(identifier.parent)) {
		throw new Error(`resolveIdentifier: Can not resolve identifier "${identifier.text}", identifier does not have a parent node.`);
	}

	const name = identifier.text;

	let sourceFile: ts.SourceFile;
	let parent: ts.Node = identifier.parent;
	let resolvedIdentifier: ResolvedIdentifier<T> = undefined;

	// 1. try to resolve in current source file
	while (parent && !exists(resolvedIdentifier)) {
		let reachedIdentifier: boolean = false;

		ts.forEachChild(parent, (childNode: ts.Node) => {
			if (reachedIdentifier || exists(resolvedIdentifier)) {
				return;
			}

			if (childNode === identifier) {
				reachedIdentifier = true;
				return;
			}

			const tryNode = _checkAndExtractNodeName(name, childNode);

			if (tryNode) {
				resolvedIdentifier = {
					dependencies: [],
					node: <T>tryNode,
					originalName: name,
				};
			}
		});

		if (ts.isSourceFile(parent)) {
			sourceFile = <ts.SourceFile>parent;
		}

		parent = parent.parent;
	}

	// 2. resolve from imported modules
	if (!resolvedIdentifier && sourceFile) {
		ts.forEachChild(sourceFile, (childNode: ts.Node) => {
			if (resolvedIdentifier) {
				return;
			}

			if (!ts.isImportDeclaration(childNode)) {
				return;
			}

			const importDeclaration = <ts.ImportDeclaration>childNode;
			const resolveInImport = canImportIdentifier(name, importDeclaration);

			if (resolveInImport === false) {
				return;
			}

			const importPath = (<ts.StringLiteral>importDeclaration.moduleSpecifier).text;
			const importFile = resolveRequire(sourceFile.fileName, importPath, compilerOptions, moduleResolutionHost);
			const importSourceFile = <ts.SourceFile>ts.createSourceFile(importFile.path, importFile.source, sourceFile.languageVersion);
			const resolvedExport = resolveExport<T>(resolveInImport, importSourceFile, compilerOptions, moduleResolutionHost);

			if (resolvedExport) {
				resolvedIdentifier = {
					dependencies: merge([importFile.path], resolvedExport.dependencies),
					node: resolvedExport.node,
					originalName: resolvedExport.originalName,
					sourceFile: exists(resolvedExport.sourceFile) ? resolvedExport.sourceFile : importSourceFile,
				};
			}
		});
	}

	return resolvedIdentifier;
}


function canImportIdentifier(name: string, importDeclaration: ts.ImportDeclaration): string|false
{
	if (!ts.isStringLiteral(importDeclaration.moduleSpecifier)) {
		return false;
	}

	if (!importDeclaration.importClause) {
		return false;
	}

	if (!importDeclaration.importClause.namedBindings) {
		return false;
	}

	if (!ts.isNamedImports(importDeclaration.importClause.namedBindings)) {
		return false;
	}

	let found: string|false = false;

	ts.forEachChild(importDeclaration.importClause.namedBindings, (element: ts.ImportSpecifier) => {
		if (found !== false) {
			return;
		}

		if ((<ts.Identifier>element.name).text === name) {
			found = exists(element.propertyName) ? (<ts.Identifier>element.propertyName).text : name;
		}
	});

	return found;
}
