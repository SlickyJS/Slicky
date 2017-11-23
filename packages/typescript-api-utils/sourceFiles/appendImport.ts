import {clone, exists, find} from '@slicky/utils';
import {findNodesByType} from './findNodesByType';
import * as ts from 'typescript';


export function appendImport(moduleSpecifier: string, propertyName: string|undefined, name: string, sourceFile: ts.SourceFile, noImportReuseOnDifferentNames: boolean = false): string
{
	const imports = findNodesByType<ts.ImportDeclaration>(ts.SyntaxKind.ImportDeclaration, sourceFile);
	const pos = imports.length ? (sourceFile.statements.indexOf(imports[imports.length - 1]) + 1 || 0) : 0;

	const existingImport: ts.ImportDeclaration = find(imports, (existingImport: ts.ImportDeclaration) => {
		return (
			exists(existingImport.importClause) &&
			exists(existingImport.importClause.namedBindings) &&
			ts.isNamedImports(existingImport.importClause.namedBindings) &&
			ts.isStringLiteral(existingImport.moduleSpecifier) &&
			(<ts.StringLiteral>existingImport.moduleSpecifier).text === moduleSpecifier
		);
	});

	if (existingImport) {
		const namedBindings = <ts.NamedImports>existingImport.importClause.namedBindings;
		const elements = clone(namedBindings.elements);

		let existingElement: ts.ImportSpecifier = find(elements, (existingElement: ts.ImportSpecifier) => {
			return (
				(<ts.Identifier>existingElement.name).text === name ||
				(
					exists(existingElement.propertyName) &&
					(<ts.Identifier>existingElement.propertyName).text === name
				) ||
				(
					exists(propertyName) &&
					exists(existingElement.propertyName) &&
					(<ts.Identifier>existingElement.propertyName).text === propertyName
				) ||
				(
					!exists(existingElement.propertyName) &&
					exists(propertyName) &&
					(<ts.Identifier>existingElement.name).text === propertyName
				)
			);
		});

		if (noImportReuseOnDifferentNames && existingElement && (<ts.Identifier>existingElement.name).text !== name) {
			existingElement = undefined;
		}

		if (existingElement) {
			if (exists(propertyName) && exists(existingElement.propertyName) && propertyName !== (<ts.Identifier>existingElement.propertyName).text) {
				throw new Error(`appendImport: can not append new import {${propertyName} as ${name}}. File already contains import with the same name {${(<ts.Identifier>existingElement.propertyName).text} as ${(<ts.Identifier>existingElement.name).text}}.`);
			}

			return (<ts.Identifier>existingElement.name).text;

		} else {
			elements.push(createNewImportSpecifier(propertyName, name));
			namedBindings.elements = elements;
		}

	} else {
		const statements = clone(sourceFile.statements);

		statements.splice(pos, 0, createNewImportDeclaration(moduleSpecifier, propertyName, name));
		sourceFile.statements = statements;
	}

	return name;
}


function createNewImportDeclaration(moduleSpecifier: string, propertyName: string|undefined, name: string): ts.ImportDeclaration
{
	return ts.createImportDeclaration(
		[],
		[],
		ts.createImportClause(
			undefined,
			ts.createNamedImports([
				createNewImportSpecifier(propertyName, name),
			]),
		),
		ts.createLiteral(moduleSpecifier),
	);
}


function createNewImportSpecifier(propertyName: string|undefined, name: string): ts.ImportSpecifier
{
	return ts.createImportSpecifier(
		exists(propertyName) ? ts.createIdentifier(propertyName) : undefined,
		ts.createIdentifier(name),
	);
}
