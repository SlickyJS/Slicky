import {exists} from '@slicky/utils';
import * as ts from 'typescript';
import * as path from 'path';


export declare interface RequiredFile
{
	path: string,
	source: string,
}


export function resolveRawRequire(fromFile: string, file: string, moduleResolutionHost: ts.ModuleResolutionHost): RequiredFile|undefined
{
	if (!path.isAbsolute(fromFile) && path.dirname(fromFile) === '.') {
		fromFile = `/${fromFile}`;
	}

	const directory = path.dirname(fromFile);
	const resolved = path.resolve(directory, file);

	const tryFiles = [resolved];

	if (path.dirname(resolved) === '/') {
		tryFiles.push(resolved.substr(1));
	}

	for (let i = 0; i < tryFiles.length; i++) {
		if (moduleResolutionHost.fileExists(tryFiles[i])) {
			return {
				path: tryFiles[i],
				source: moduleResolutionHost.readFile(tryFiles[i]),
			};
		}
	}
}


export function resolveRequire(fromFile: string, file: string, compilerOptions: ts.CompilerOptions, moduleResolutionHost: ts.ModuleResolutionHost): RequiredFile|undefined
{
	const module = <ts.ResolvedModuleWithFailedLookupLocations>ts.resolveModuleName(file, fromFile, compilerOptions, moduleResolutionHost);

	if (!exists(module.resolvedModule)) {
		return;
	}

	return {
		path: module.resolvedModule.resolvedFileName,
		source: moduleResolutionHost.readFile(module.resolvedModule.resolvedFileName),
	};
}
