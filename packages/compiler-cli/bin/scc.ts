#!/usr/bin/env node

import * as yargs from 'yargs';
import * as path from 'path';
import * as colors from 'colors/safe';
import {existsSync} from 'fs';
import {forEach, exists} from '@slicky/utils';
import {Compiler, CompiledTemplate} from '../compiler';


const args = yargs
	.usage('$0 <cmd> [args]')
	.command('compile [tsconfig]', 'Compile given app components', {
		tsconfig: {
			describe: 'Path to your project tsconfig.json file',
		},
	})
	.coerce('tsconfig', (arg) => {
		if (existsSync(arg)) {
			return arg;
		}

		return path.join(process.cwd(), arg);
	})
	.strict(true)
	.help()
	.argv;


if (args._[0] !== 'compile') {
	throw new Error('Unknown command.');
}


console.log(`Using typescript config file ${colors.yellow(path.relative(process.cwd(), args.tsconfig))}`);
console.log('');


const compiler = new Compiler(args.tsconfig);


compiler.compile((templates) => {
	const files: {[file: string]: Array<CompiledTemplate>} = {};

	forEach(templates, (template: CompiledTemplate) => {
		if (!exists(files[template.file])) {
			files[template.file] = [];
		}

		files[template.file].push(template);
	});

	forEach(files, (templates: Array<CompiledTemplate>, file: string) => {
		console.log(colors.yellow(path.relative(process.cwd(), file)));

		forEach(templates, (template: CompiledTemplate) => {
			console.log(`   - ${template.name}`);
		});
	});

	if (templates.length) {
		console.log('');
		console.log(colors.green(`Successfully generated ${templates.length} templates into ${path.relative(process.cwd(), compiler.getConfig().outDir)}`));
	} else {
		console.log(colors.green('No components found'));
	}
});
