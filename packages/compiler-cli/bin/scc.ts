#!/usr/bin/env node

import * as yargs from 'yargs';
import * as path from 'path';
import * as colors from 'colors/safe';
import {existsSync} from 'fs';
import {forEach} from '@slicky/utils';
import {Compiler, ParsedFile, ParsedComponent} from '../compiler';


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


compiler.compile((files) => {
	let componentsLength = 0;

	forEach(files, (file: ParsedFile) => {
		if (!file.components.length) {
			return;
		}

		console.log(colors.yellow(path.relative(process.cwd(), file.file)));

		forEach(file.components, (component: ParsedComponent) => {
			componentsLength++;
			console.log(`   - ${component.name}`);
		});
	});

	if (componentsLength) {
		console.log('');
		console.log(colors.green(`Successfully generated ${componentsLength} templates into ${path.relative(process.cwd(), compiler.getConfig().outDir)}`));
	} else {
		console.log(colors.green('No components found'));
	}
});
