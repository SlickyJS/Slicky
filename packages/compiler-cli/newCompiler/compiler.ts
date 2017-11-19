import {FileAnalyzer} from '../analyzers';
import {createFilterTransformer, createDirectiveTransformer} from '../transformers';
import * as ts from 'typescript';


export declare interface CompiledFileResult
{
	dependencies: Array<string>
	sourceText: string,
	sourceFile: ts.SourceFile,
}


export class Compiler
{


	private fileAnalyzer: FileAnalyzer;

	private compilerOptions: ts.CompilerOptions;

	private moduleResolutionHost: ts.ModuleResolutionHost;


	constructor(fileAnalyzer: FileAnalyzer, compilerOptions: ts.CompilerOptions, moduleResolutionHost: ts.ModuleResolutionHost)
	{
		this.fileAnalyzer = fileAnalyzer;
		this.compilerOptions = compilerOptions;
		this.moduleResolutionHost = moduleResolutionHost;
	}


	public compileFile(fileName: string, source: string): CompiledFileResult
	{
		let dependencies: Array<string> = [];

		const sourceFile = <ts.SourceFile>ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true);
		const result = <ts.TransformationResult<ts.SourceFile>>ts.transform<ts.SourceFile>(sourceFile, [
			createFilterTransformer(this.fileAnalyzer, this.compilerOptions, this.moduleResolutionHost),
			createDirectiveTransformer(this.fileAnalyzer, this.compilerOptions, this.moduleResolutionHost, (file) => {
				dependencies = file.dependencies;
			}),
		], this.compilerOptions);

		const printer = <ts.Printer>ts.createPrinter({
			newLine: ts.NewLineKind.LineFeed,
		});

		return {
			dependencies: dependencies,
			sourceText: printer.printNode(ts.EmitHint.SourceFile, result.transformed[0], result.transformed[0]),
			sourceFile: result.transformed[0],
		};
	}

}
