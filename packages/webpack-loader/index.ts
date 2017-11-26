import {Compiler} from '@slicky/compiler-cli';
import {FilterAnalyzer, DirectiveAnalyzer, FileAnalyzer} from '@slicky/compiler-cli/analyzers';
import {fsModuleResolutionHost} from '@slicky/typescript-api-utils';
import * as ts from 'typescript';


const compilerOptions = {} || ts.getDefaultCompilerOptions();
const moduleResolutionHost = fsModuleResolutionHost();

const filterAnalyzer = new FilterAnalyzer;
const directiveAnalyzer = new DirectiveAnalyzer(filterAnalyzer, compilerOptions, moduleResolutionHost);
const fileAnalyzer = new FileAnalyzer(directiveAnalyzer, filterAnalyzer);

const compiler = new Compiler(fileAnalyzer, compilerOptions, moduleResolutionHost);


export default function(source: string): string
{
	return compiler.compileFile(this.resourcePath, source).sourceText;

	/*const callback = this.async();
	const compiler = new Compiler;

	compiler.compileFile(this.resourcePath, (err, file) => {
		if (err) {
			callback(err);
		} else {
			callback(null, file.source, sourcemap);
		}
	});*/
}
