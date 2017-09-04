import 'reflect-metadata';
import {exists, forEach} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {DirectiveMetadataLoader, DirectiveDefinitionType} from '@slicky/core/metadata';
import {ExtensionsManager} from '@slicky/core/extensions';
import {Compiler} from '@slicky/compiler';
import {Application} from '@slicky/application';
import {readFileSync} from 'fs';
import * as path from 'path';
import {CompilerSlickyOptions} from './';


const TSCONFIG_SLICKY_COMPILER_OPTIONS = 'slickyCompilerOptions';
const APPLICATION_EXPORT = 'APPLICATION';


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

if (!exists(tsconfig[TSCONFIG_SLICKY_COMPILER_OPTIONS].applicationFile)) {
	process.send({error: `Missing "${TSCONFIG_SLICKY_COMPILER_OPTIONS}.applicationFile" in ${tsconfigPath}`});
	process.exit(1);
}

if (!exists(tsconfig[TSCONFIG_SLICKY_COMPILER_OPTIONS].outDir)) {
	process.send({error: `Missing "${TSCONFIG_SLICKY_COMPILER_OPTIONS}.outDir" in ${tsconfigPath}`});
	process.exit(1);
}


const slickyCompilerOptions: CompilerSlickyOptions = {
	outDir: path.join(path.dirname(tsconfigPath), tsconfig[TSCONFIG_SLICKY_COMPILER_OPTIONS].outDir),
	applicationFile: path.join(path.dirname(tsconfigPath), tsconfig[TSCONFIG_SLICKY_COMPILER_OPTIONS].applicationFile),
};


process.send({slickyCompilerOptions: slickyCompilerOptions});


const applicationFile = require(slickyCompilerOptions.applicationFile);


if (!exists(applicationFile[APPLICATION_EXPORT])) {
	process.send({error: `Missing ${APPLICATION_EXPORT} export in ${applicationFile}`});
	process.exit(1);
}


const application: Application = applicationFile[APPLICATION_EXPORT];

const metadataLoader = new DirectiveMetadataLoader(new ExtensionsManager);
const compiler = new Compiler;


forEach(application.getDirectives(), (directive: ClassType<any>) => {
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
