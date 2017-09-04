#!/usr/bin/env node

import * as yargs from 'yargs';
import * as path from 'path';
import * as colors from 'colors/safe';
import {existsSync} from 'fs';
import {keys} from '@slicky/utils';
import {Compiler, CompilerTemplatesList} from '../compiler';


let args = yargs
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


(new Compiler).compileAndWrite(args.tsconfig, (outDir: string, factory: string, templates: CompilerTemplatesList) => {
	console.log(colors.green(`Successfully generated ${keys(templates).length} templates into ${path.relative(process.cwd(), outDir)}`));
});
