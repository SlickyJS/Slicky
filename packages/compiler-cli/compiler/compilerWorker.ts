import 'reflect-metadata';
import {forEach, exists, isString} from '@slicky/utils';
import {DirectiveMetadataLoader, DirectiveDefinition} from '@slicky/core/metadata';
import {ExtensionsManager} from '@slicky/core/extensions';
import {Compiler} from '@slicky/compiler';
import {readFileSync} from 'fs';


if (!exists(process.env.COMPILE_FILE)) {
	process.send({error: 'Missing COMPILE_FILE environment variable.'});
	process.exit(1);
}


if (!exists(process.env.COMPILE_EXPORTS)) {
	process.send({error: 'Missing COMPILE_EXPORTS environment variable.'});
	process.exit(1);
}


const file: string = process.env.COMPILE_FILE;
const directives: Array<string> = process.env.COMPILE_EXPORTS.split(',');


require('ts-node').register({
	fast: true,
});

require.extensions['.html'] = (module, filename) => {
	module.exports = readFileSync(filename, 'utf8');
};

require.extensions['.css'] = (module, filename) => {
	module.exports = readFileSync(filename, 'utf8');
};


const compiler = Compiler.createAotCompiler();
const metadataLoader = new DirectiveMetadataLoader(new ExtensionsManager);

const fileExports = require(file);

forEach(directives, (directiveExport: string) => {
	const directive = fileExports[directiveExport];

	let metadata: DirectiveDefinition;
	let template: string;

	try {
		metadata = metadataLoader.loadDirective(directive);
	} catch (e) {
		process.send({error: e.message});
		process.exit(1);
	}

	if (isString(metadata.template)) {
		try {
			template = compiler.compile(metadata);
		} catch (e) {
			process.send({error: e.message});
			process.exit(1);
		}
	}

	process.send({
		directive: {
			file: file,
			type: metadata.type,
			name: metadata.className,
			template: template,
		},
	});
});
