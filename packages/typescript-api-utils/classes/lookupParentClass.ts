import {exists, forEach, merge} from '@slicky/utils';
import {resolveIdentifier, ResolvedIdentifier} from '../resolvers';
import * as ts from 'typescript';


export declare interface ClassDeclarationWithParents
{
	parents: Array<ResolvedIdentifier<ts.ClassDeclaration>>,
}


export function lookupParentClasses(classDeclaration: ts.ClassDeclaration, compilerOptions: ts.CompilerOptions, moduleResolutionHost: ts.ModuleResolutionHost): ClassDeclarationWithParents
{
	const result: ClassDeclarationWithParents = {
		parents: [],
	};

	if (!exists(classDeclaration.heritageClauses)) {
		return result;
	}

	forEach(classDeclaration.heritageClauses, (heritageClause: ts.HeritageClause) => {
		forEach(heritageClause.types, (parentClass: ts.ExpressionWithTypeArguments) => {
			if (!ts.isIdentifier(parentClass.expression)) {
				return;
			}

			result.parents.push(resolveIdentifier<ts.ClassDeclaration>(parentClass.expression, compilerOptions, moduleResolutionHost));
		});
	});

	return result;
}


export function lookupDeepParentClasses(classDeclaration: ts.ClassDeclaration, compilerOptions: ts.CompilerOptions, moduleResolutionHost: ts.ModuleResolutionHost): ClassDeclarationWithParents
{
	const result: ClassDeclarationWithParents = {
		parents: [],
	};

	const classes = lookupParentClasses(classDeclaration, compilerOptions, moduleResolutionHost);
	result.parents = merge(result.parents, classes.parents);

	forEach(classes.parents, (parent: ResolvedIdentifier<ts.ClassDeclaration>) => {
		const innerClasses = lookupDeepParentClasses(parent.node, compilerOptions, moduleResolutionHost);
		result.parents = merge(result.parents, innerClasses.parents);
	});

	return result;
}
