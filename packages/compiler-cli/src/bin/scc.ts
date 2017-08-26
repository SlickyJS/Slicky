#!/usr/bin/env node

import 'reflect-metadata';
import * as yargs from 'yargs';
import * as path from 'path';
import * as colors from 'colors/safe';
import {readFileSync, writeFileSync} from 'fs';
import {exists, forEach, indent} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {DirectiveMetadataLoader, DirectiveDefinitionType} from '@slicky/core';
import {Compiler} from '@slicky/compiler';


let args = yargs
	.usage('$0 <cmd> [args]')
	.command('compile [tsconfig]', 'Compile given app components', {
		tsconfig: {
			describe: 'Path to your project tsconfig.json file',
		},
	})
	.coerce('tsconfig', (arg) => {
		return path.join(process.cwd(), arg);
	})
	.strict(true)
	.help()
	.argv;


require.extensions['.html'] = (module, filename) => {
	module.exports = readFileSync(filename, 'utf8');
};


require('ts-node').register({
	project: args.tsconfig,
	fast: true,
});


if (args._[0] !== 'compile') {
	throw new Error('Unknown command.');
}


console.log(`Using typescript config file ${colors.yellow(path.relative(process.cwd(), args.tsconfig))}`);


let tsconfig = JSON.parse(readFileSync(args.tsconfig, 'utf8'));

if (!exists(tsconfig.slickyCompilerOptions.directives)) {
	// todo: error
}

if (!exists(tsconfig.slickyCompilerOptions.outDir)) {
	// todo: error
}

let directivesFile = require(path.join(path.dirname(args.tsconfig), tsconfig.slickyCompilerOptions.directives));
let outDir = path.join(path.dirname(args.tsconfig), tsconfig.slickyCompilerOptions.outDir);

if (!exists(directivesFile.APP_DIRECTIVES)) {
	// todo: error
}

let directives: Array<ClassType<any>> = directivesFile.APP_DIRECTIVES;

let metadataLoader = new DirectiveMetadataLoader;
let compiler = new Compiler;

forEach(directives, (directive: ClassType<any>) => {
	let metadata = metadataLoader.load(directive);

	if (metadata.type !== DirectiveDefinitionType.Component) {
		return;
	}

	compiler.compile(metadata);
});

let templates = [];
let templateFactories = [];
let templateMappings = [];
forEach(compiler.getTemplates(), (template: string, hash: number) => {
	templateFactories.push(
		`function _factory${hash}()\n` +
		`{\n` +
		`${indent(template)}(Template);\n` +
		`}\n`
	);

	templateMappings.push(
		`${hash}: _factory${hash}`
	);
});

let factory = (
	`import {Template} from '@slicky/templates-runtime';\n\n\n` +
	`${templateFactories.join('\n\n')}\n\n` +
	`const _mapping = {\n` +
	`${indent(templateMappings.join(',\n'))}\n` +
	`};\n\n\n` +
	`function _factory(hash: number)\n` +
	`{\n` +
	`	if (typeof _mapping[hash] === 'undefined') {\n` +
	`		throw new Error("Component template " + hash + " does not exists.");\n` +
	`	}\n\n` +
	`	return _mapping[hash]();\n` +
	`}\n\n\n` +
	`export const APP_TEMPLATES_FACTORY = _factory;\n`
);

writeFileSync(path.join(outDir, 'app-templates-factory.ts'), factory, {encoding: 'utf8'});

console.log(colors.green(`Successfully generated ${templates.length} templates into ${path.relative(process.cwd(), outDir)}`));
