import 'reflect-metadata';
import {exists, forEach} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {DirectiveMetadataLoader, DirectiveDefinitionType, ExtensionsManager} from '@slicky/core';
import {Compiler} from '@slicky/compiler';
import {readFileSync} from 'fs';
import * as path from 'path';
import {CompilerSlickyOptions} from './compiler';


const TSCONFIG_SLICKY_COMPILER_OPTIONS = 'slickyCompilerOptions';
const APP_DIRECTIVES_EXPORT = 'APP_DIRECTIVES';


const tsconfigPath = process.env.TSCONFIG_PATH;


if (!exists(tsconfigPath)) {
	process.send({error: 'Missing TSCONFIG_PATH environment variable'});
	process.exit(1);
}


require.extensions['.html'] = (module, filename) => {
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

if (!exists(tsconfig[TSCONFIG_SLICKY_COMPILER_OPTIONS].directivesFile)) {
	process.send({error: `Missing "${TSCONFIG_SLICKY_COMPILER_OPTIONS}.directivesFile" in ${tsconfigPath}`});
	process.exit(1);
}

if (!exists(tsconfig[TSCONFIG_SLICKY_COMPILER_OPTIONS].outDir)) {
	process.send({error: `Missing "${TSCONFIG_SLICKY_COMPILER_OPTIONS}.outDir" in ${tsconfigPath}`});
	process.exit(1);
}


const slickyCompilerOptions: CompilerSlickyOptions = {
	outDir: path.join(path.dirname(tsconfigPath), tsconfig[TSCONFIG_SLICKY_COMPILER_OPTIONS].outDir),
	directivesFile: path.join(path.dirname(tsconfigPath), tsconfig[TSCONFIG_SLICKY_COMPILER_OPTIONS].directivesFile),
};


process.send({slickyCompilerOptions: slickyCompilerOptions});


const directivesFile = require(slickyCompilerOptions.directivesFile);


if (!exists(directivesFile[APP_DIRECTIVES_EXPORT])) {
	process.send({error: `Missing ${APP_DIRECTIVES_EXPORT} export in ${directivesFile}`});
	process.exit(1);
}


const directives: Array<ClassType<any>> = directivesFile.APP_DIRECTIVES;

const metadataLoader = new DirectiveMetadataLoader(new ExtensionsManager);
const compiler = new Compiler;


forEach(directives, (directive: ClassType<any>) => {
	let metadata = metadataLoader.load(directive);

	if (metadata.type !== DirectiveDefinitionType.Component) {
		return;
	}

	compiler.compile(metadata);
});


forEach(compiler.getTemplates(), (template: string, hash: number) => {
	process.send({
		template: {
			hash: hash,
			template: template,
		},
	});
});


process.exit(0);
