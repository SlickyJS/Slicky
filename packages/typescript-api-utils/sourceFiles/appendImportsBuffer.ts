import {forEach} from '@slicky/utils';
import {appendImport} from './appendImport';
import * as ts from 'typescript';


export declare interface ImportItem
{
	moduleSpecifier: string,
	propertyName: string|undefined,
	name: string,
}


export class AppendImportsBuffer
{


	private imports: Array<ImportItem> = [];


	public add(moduleSpecifier: string, propertyName: string|undefined, name: string): void
	{
		this.imports.push({
			moduleSpecifier: moduleSpecifier,
			propertyName: propertyName,
			name: name,
		});
	}


	public applyImports(sourceFile: ts.SourceFile): void
	{
		forEach(this.imports, (newImport: ImportItem) => {
			appendImport(newImport.moduleSpecifier, newImport.propertyName, newImport.name, sourceFile, true);
		});
	}

}
