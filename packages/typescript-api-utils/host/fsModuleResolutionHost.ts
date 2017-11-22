import * as ts from 'typescript';
import * as fs from 'fs';


export function fsModuleResolutionHost(): ts.ModuleResolutionHost
{
	function fileExists(fileName: string): boolean
	{
		return fs.existsSync(fileName) && fs.statSync(fileName).isFile();
	}

	function readFile(fileName: string): string|undefined
	{
		if (!fileExists(fileName)) {
			return;
		}

		return <string>fs.readFileSync(fileName, {encoding: 'utf8'});
	}

	function directoryExists(directoryName: string): boolean
	{
		return fs.existsSync(directoryName) && fs.statSync(directoryName).isDirectory();
	}

	return {
		fileExists: fileExists,
		readFile: readFile,
		directoryExists: directoryExists,
	};
}
