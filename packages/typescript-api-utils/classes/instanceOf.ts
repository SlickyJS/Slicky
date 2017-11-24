import {find, exists} from '@slicky/utils';
import {lookupDeepParentClasses} from './lookupParentClass';
import {ResolvedIdentifier} from '../resolvers';
import {lookupSourceFile} from '../sourceFiles';
import * as ts from 'typescript';


export function isClassInstanceOf(classDeclaration: ts.ClassDeclaration, parentClass: ts.ClassDeclaration, compilerOptions: ts.CompilerOptions, moduleResolutionHost: ts.ModuleResolutionHost): boolean
{
	if (classDeclaration === parentClass) {
		return true;
	}

	const classDeclarationSourceFile = lookupSourceFile(classDeclaration);
	const parentClassSourceFile = lookupSourceFile(parentClass);

	if (
		classDeclarationSourceFile.fileName === parentClassSourceFile.fileName &&
		exists(classDeclaration.name) &&
		exists(parentClass.name) &&
		(<ts.Identifier>classDeclaration.name).text === (<ts.Identifier>parentClass.name).text
	) {
		return true;
	}

	const parents = lookupDeepParentClasses(classDeclaration, compilerOptions, moduleResolutionHost);

	if (!parents.parents.length) {
		return false;
	}

	const foundParent = find(parents.parents, (parent: ResolvedIdentifier<ts.ClassDeclaration>) => {
		if (parent.node === parentClass) {
			return true;
		}

		if (!parent.imported) {
			return false;
		}

		if (!exists(parentClass.name)) {
			return false;
		}

		if (parentClassSourceFile.fileName !== parent.sourceFile.fileName) {
			return false;
		}

		return (<ts.Identifier>parentClass.name).text === parent.originalName;
	});

	return exists(foundParent);
}
