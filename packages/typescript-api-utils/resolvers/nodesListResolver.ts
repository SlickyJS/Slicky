import {forEach, merge, unique} from '@slicky/utils';
import {resolveIdentifier, ResolvedIdentifier} from './identifierResolver';
import * as ts from 'typescript';


export declare interface ResolvedNodesList<T extends ts.Node>
{
	dependencies: Array<string>,
	nodes: Array<ResolvedIdentifier<T>>,
}


export function resolveIdentifierAsFlatNodesList<T extends ts.Node>(identifier: ts.Identifier, compilerOptions: ts.CompilerOptions, moduleResolutionHost: ts.ModuleResolutionHost): ResolvedNodesList<T>
{
	const result: ResolvedNodesList<T> = {
		dependencies: [],
		nodes: [],
	};

	const resolvedIdentifier = resolveIdentifier<T>(identifier, compilerOptions, moduleResolutionHost);

	if (resolvedIdentifier) {
		result.dependencies = merge(result.dependencies, resolvedIdentifier.dependencies);

		if (ts.isArrayLiteralExpression(resolvedIdentifier.node)) {
			ts.forEachChild(<ts.ArrayLiteralExpression>resolvedIdentifier.node, (element: ts.Expression) => {
				if (ts.isIdentifier(element)) {
					const innerList = resolveIdentifierAsFlatNodesList(<ts.Identifier>element, compilerOptions, moduleResolutionHost);

					result.dependencies = merge(result.dependencies, innerList.dependencies);

					forEach(innerList.nodes, (innerNode: ResolvedIdentifier<T>) => {
						result.nodes.push(innerNode);
					});

				} else {
					result.dependencies = merge(result.dependencies, resolvedIdentifier.dependencies);
					result.nodes.push({
						node: <any>element,
						dependencies: resolvedIdentifier.dependencies,
						originalName: resolvedIdentifier.originalName,
						imported: resolvedIdentifier.imported,
						sourceFile: resolvedIdentifier.sourceFile,
					})
				}
			});

		} else {
			result.nodes.push(resolvedIdentifier);
		}

		result.dependencies = unique(result.dependencies);
	}

	return result;
}
