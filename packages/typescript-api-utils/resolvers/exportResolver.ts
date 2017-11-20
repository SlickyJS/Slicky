import {exists, find} from '@slicky/utils';
import {_checkAndExtractNodeName} from './_utils';
import {resolveRequire} from './requireResolver';
import * as ts from 'typescript';


export declare interface ResolvedExport<T extends ts.Node>
{
	dependencies: Array<string>,
	node: T,
	originalName: string,
	sourceFile?: ts.SourceFile,
}


export function resolveExport<T extends ts.Node>(name: string, source: ts.SourceFile, compilerOptions: ts.CompilerOptions, moduleResolutionHost: ts.ModuleResolutionHost): ResolvedExport<T>|undefined
{
	const result = _resolveExport<T>(name, source, compilerOptions, moduleResolutionHost, false);

	if (result) {
		result.dependencies.reverse();
	}

	return result;
}


function _resolveExport<T extends ts.Node>(name: string, source: ts.SourceFile, compilerOptions: ts.CompilerOptions, moduleResolutionHost: ts.ModuleResolutionHost, includeSourceFile: boolean): ResolvedExport<T>|undefined
{
	let foundNode: ResolvedExport<T> = undefined;

	ts.forEachChild(source, (childNode: ts.Node) => {
		if (foundNode) {
			return;
		}

		if (ts.isExportDeclaration(childNode)) {
			const exportDeclaration = <ts.ExportDeclaration>childNode;

			if (!exportDeclaration.moduleSpecifier) {
				return;
			}

			if (!ts.isStringLiteral(exportDeclaration.moduleSpecifier)) {
				return;
			}

			let innerName: string = name;

			if (exportDeclaration.exportClause) {
				const exportElements = (<ts.NamedExports>exportDeclaration.exportClause).elements;
				const foundExportElement = <ts.ExportSpecifier>find(exportElements, (exportElement: ts.ExportSpecifier) => {
					return (<ts.Identifier>exportElement.name).text === name;
				});

				if (!exists(foundExportElement)) {
					return;
				}

				if (exists(foundExportElement.propertyName)) {
					innerName = (<ts.Identifier>foundExportElement.propertyName).text;
				}
			}

			const exportFile = resolveRequire(source.fileName, (<ts.StringLiteral>exportDeclaration.moduleSpecifier).text, compilerOptions, moduleResolutionHost);
			const exportSource = <ts.SourceFile>ts.createSourceFile(exportFile.path, exportFile.source, source.languageVersion);
			const innerFoundNode = _resolveExport<T>(innerName, exportSource, compilerOptions, moduleResolutionHost, true);

			if (innerFoundNode) {
				foundNode = innerFoundNode;

				if (foundNode.dependencies.indexOf(exportFile.path) < 0) {
					foundNode.dependencies.push(exportFile.path);
				}
			}

			return;
		}

		if (!exists(childNode.modifiers)) {
			return;
		}

		const foundExportModifier = find(childNode.modifiers, (modifier: ts.Modifier) => {
			return modifier.kind === ts.SyntaxKind.ExportKeyword;
		});

		if (!exists(foundExportModifier)) {
			return;
		}

		const tryNode = _checkAndExtractNodeName(name, childNode);

		if (tryNode) {
			foundNode = {
				dependencies: [],
				node: <T>tryNode,
				originalName: name,
			};

			if (includeSourceFile) {
				foundNode.sourceFile = source;
			}
		}
	});

	return foundNode;
}
