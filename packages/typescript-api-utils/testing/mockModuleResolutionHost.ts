import {exists, forEach} from '@slicky/utils';
import * as ts from 'typescript';
import * as path from 'path';


export function mockModuleResolutionHost(files: {[name: string]: string} = {}, directories: Array<string> = []): ts.ModuleResolutionHost
{
	forEach(files, (source: string, fileName: string) => {
		let directoryName: string = path.dirname(fileName);

		while (true) {
			if (directories.indexOf(directoryName) < 0) {
				directories.push(directoryName);
			}

			if (directoryName === path.dirname(directoryName)) {
				break;
			}

			directoryName = path.dirname(directoryName);
		}
	});

	return {
		fileExists: (fileName) => exists(files[fileName]),
		readFile: (fileName) => files[fileName],
		directoryExists: (directoryName) => directories.indexOf(directoryName) >= 0,
	};
}
