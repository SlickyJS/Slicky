import {find, clone} from '@slicky/utils';
import {AppendImportsBuffer} from '@slicky/typescript-api-utils';
import {STATIC_FILTER_METADATA_STORAGE, FilterMetadata} from '@slicky/core/metadata';
import {FileAnalyzer, FileDefinitionFilter} from '../analyzers';
import * as ts from 'typescript';


export function createFilterTransformer(fileAnalyzer: FileAnalyzer, compilerOptions: ts.CompilerOptions, moduleResolutionHost: ts.ModuleResolutionHost): ts.TransformerFactory<ts.SourceFile>
{
	return function filterTransformer(context: ts.TransformationContext): ts.Transformer<ts.SourceFile>
	{
		return (sourceFile: ts.SourceFile) => {
			const analyzedFile = fileAnalyzer.analyzeFile(sourceFile);
			const importsBuffer = new AppendImportsBuffer;

			function visit(node: ts.Node): ts.Node
			{
				if (ts.isClassDeclaration(node) && (<ts.ClassDeclaration>node).name) {
					const filterClass = <ts.ClassDeclaration>node;
					const filter: FileDefinitionFilter = find(analyzedFile.filters, (filter: FileDefinitionFilter) => {
						return filter.metadata.className === (<ts.Identifier>filterClass.name).text;
					});

					if (filter) {
						importsBuffer.add('@slicky/core/metadata', undefined, 'FilterMetadata');

						const members = clone(filterClass.members);

						members.push(ts.createProperty(
							[],
							[
								ts.createToken(ts.SyntaxKind.PublicKeyword),
								ts.createToken(ts.SyntaxKind.StaticKeyword),
							],
							STATIC_FILTER_METADATA_STORAGE,
							undefined,
							ts.createTypeReferenceNode('FilterMetadata', undefined),
							createMetadataPropertyObject(filter.metadata),
						));

						return ts.createClassDeclaration(
							[],
							filterClass.modifiers,
							filterClass.name,
							filterClass.typeParameters,
							filterClass.heritageClauses,
							members,
						);
					}
				}

				return ts.visitEachChild(node, visit, context);
			}

			sourceFile = ts.visitNode(sourceFile, visit);
			importsBuffer.applyImports(sourceFile, compilerOptions, moduleResolutionHost);

			return sourceFile;
		};
	}
}


function createMetadataPropertyObject(metadata: FilterMetadata): ts.ObjectLiteralExpression
{
	return ts.createObjectLiteral([
		ts.createPropertyAssignment('className', ts.createLiteral(metadata.className)),
		ts.createPropertyAssignment('name', ts.createLiteral(metadata.name)),
	], true);
}
