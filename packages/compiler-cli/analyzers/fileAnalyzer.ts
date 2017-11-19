import {exists, merge, unique} from '@slicky/utils';
import {FilterMetadata, DirectiveDefinition} from '@slicky/core/metadata';
import * as ts from 'typescript';
import {DirectiveAnalyzer} from './directiveAnalyzer';
import {FilterAnalyzer} from './filterAnalyzer';


export declare interface FileDefinitionFilter
{
	exported: boolean,
	metadata: FilterMetadata,
}


export declare interface FileDefinitionDirective
{
	exported: boolean,
	metadata: DirectiveDefinition,
}


export declare interface FileDefinition
{
	dependencies: Array<string>,
	filters: Array<FileDefinitionFilter>,
	directives: Array<FileDefinitionDirective>,
}


export class FileAnalyzer
{


	private directiveAnalyzer: DirectiveAnalyzer;

	private filterAnalyzer: FilterAnalyzer;

	private storage: {[path: string]: FileDefinition} = {};


	constructor(directiveAnalyzer: DirectiveAnalyzer, filterAnalyzer: FilterAnalyzer)
	{
		this.directiveAnalyzer = directiveAnalyzer;
		this.filterAnalyzer = filterAnalyzer;
	}


	public analyzeFile(sourceFile: ts.SourceFile, includeInnerDirectiveNodes: boolean = true): FileDefinition
	{
		if (exists(this.storage[sourceFile.fileName])) {
			return this.storage[sourceFile.fileName];
		}

		const definition: FileDefinition = {
			dependencies: [],
			filters: [],
			directives: [],
		};

		ts.forEachChild(sourceFile, (node: ts.Node) => {
			if (!ts.isClassDeclaration(node)) {
				return;
			}

			const classDeclaration = <ts.ClassDeclaration>node;
			const filter = this.filterAnalyzer.analyzeFilter(classDeclaration, false);

			if (filter) {
				definition.filters.push({
					exported: this.isClassExported(classDeclaration),
					metadata: filter,
				});

			} else {
				const directive = this.directiveAnalyzer.analyzeDirective(classDeclaration, false, includeInnerDirectiveNodes);

				if (directive) {
					definition.dependencies = merge(definition.dependencies, directive.dependencies);
					definition.directives.push({
						exported: this.isClassExported(classDeclaration),
						metadata: directive.definition,
					});
				}
			}
		});

		definition.dependencies = unique(definition.dependencies);

		return this.storage[sourceFile.fileName] = definition;
	}


	private isClassExported(classDeclaration: ts.ClassDeclaration): boolean
	{
		let exported = false;

		ts.forEachChild(classDeclaration, (node: ts.Node) => {
			if (node.kind === ts.SyntaxKind.ExportKeyword) {
				exported = true;
			}
		});

		return exported;
	}

}
