import 'reflect-metadata';
import {exists, forEach} from '@slicky/utils';
import {DirectiveMetadataLoader, DirectiveDefinition, DirectiveDefinitionType} from '@slicky/core/metadata';
import {ExtensionsManager} from '@slicky/core/extensions';
import {Compiler} from '@slicky/compiler';
import {readFileSync} from 'fs';
import * as path from 'path';
import {CompilerSlickyOptions} from './';
import * as glob from 'glob';


const TSCONFIG_SLICKY_COMPILER_OPTIONS = 'slickyCompilerOptions';


let tsconfigPath = process.env.TSCONFIG_PATH;


if (!exists(tsconfigPath)) {
	process.send({error: 'Missing TSCONFIG_PATH environment variable'});
	process.exit(1);
}


tsconfigPath = path.resolve(tsconfigPath);
const tsconfigRoot = path.dirname(tsconfigPath);


require.extensions['.html'] = (module, filename) => {
	module.exports = readFileSync(filename, 'utf8');
};

require.extensions['.css'] = (module, filename) => {
	module.exports = readFileSync(filename, 'utf8');
};


require('ts-node').register({
	project: tsconfigPath,
	fast: true,
});


const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));


if (!exists(tsconfig[TSCONFIG_SLICKY_COMPILER_OPTIONS])) {
	process.send({error: `Missing "${TSCONFIG_SLICKY_COMPILER_OPTIONS}" in ${tsconfigPath}`});
	process.exit(1);
}


const tsconfigSlicky = tsconfig[TSCONFIG_SLICKY_COMPILER_OPTIONS];


if (!exists(tsconfigSlicky.rootDir)) {
	process.send({error: `Missing "${TSCONFIG_SLICKY_COMPILER_OPTIONS}.rootDir" in ${tsconfigPath}`});
	process.exit(1);
}

if (!exists(tsconfigSlicky.outDir)) {
	process.send({error: `Missing "${TSCONFIG_SLICKY_COMPILER_OPTIONS}.outDir" in ${tsconfigPath}`});
	process.exit(1);
}


const slickyCompilerOptions: CompilerSlickyOptions = {
	rootDir: path.join(tsconfigRoot, tsconfigSlicky.rootDir),
	outDir: path.join(tsconfigRoot, tsconfigSlicky.outDir),
	exclude: exists(tsconfigSlicky.exclude) ? tsconfigSlicky.exclude : [],
};

slickyCompilerOptions.exclude.push('**/*.d.ts');


process.send({slickyCompilerOptions: slickyCompilerOptions});


const compiler = new Compiler;
const metadataLoader = new DirectiveMetadataLoader(new ExtensionsManager);


const processedTemplates: Array<number> = [];


glob(path.join('**', '*.ts'), {
	cwd: slickyCompilerOptions.rootDir,
	ignore: slickyCompilerOptions.exclude,
	realpath: true,
	nosort: true,
	nodir: true,
}, (err, files: Array<string>) => {
	if (err) {
		process.send({error: err});
	} else {
		forEach(files, (file: string) => {
			process.send({file: file});

			const fileExports = require(file);

			forEach(fileExports, (obj: any, name: string) => {
				let metadata: DirectiveDefinition;

				try {
					metadata = metadataLoader.load(obj)
				} catch (e) {
					return;
				}

				if (metadata.type === DirectiveDefinitionType.Directive) {
					return;
				}

				if (processedTemplates.indexOf(metadata.hash) >= 0) {
					return;
				}

				processedTemplates.push(metadata.hash);

				const template = compiler.compile(metadata);

				process.send({
					template: {
						file: file,
						name: name,
						hash: metadata.hash,
						template: template,
					}
				});
			});
		});

		process.exit(0);
	}
});
