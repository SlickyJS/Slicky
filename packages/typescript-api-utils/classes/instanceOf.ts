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

	let parentClassSourceFile: ts.SourceFile = undefined;
	function getParentClassSourceFile(): ts.SourceFile
	{
		return exists(parentClassSourceFile) ? parentClassSourceFile : parentClassSourceFile = lookupSourceFile(parentClass);
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

		const parentSourceFile = getParentClassSourceFile();

		if (parentSourceFile.fileName !== parent.sourceFile.fileName) {
			return false;
		}

		return (<ts.Identifier>parentClass.name).text === parent.originalName;
	});

	return exists(foundParent);
}
