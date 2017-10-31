import 'reflect-metadata';
import {forEach, exists, isString} from '@slicky/utils';
import {DirectiveMetadataLoader, DirectiveDefinition} from '@slicky/core/metadata';
import {ExtensionsManager} from '@slicky/core/extensions';
import {Compiler} from '@slicky/compiler';
import {readFileSync} from 'fs';


const file = process.env.COMPILE_FILE;


if (!exists(file)) {
	process.send({error: 'Missing COMPILE_FILE environment variable.'});
	process.exit(1);
}


require('ts-node').register({
	fast: true,
});

require.extensions['.html'] = (module, filename) => {
	module.exports = readFileSync(filename, 'utf8');
};

require.extensions['.css'] = (module, filename) => {
	module.exports = readFileSync(filename, 'utf8');
};


const compiler = new Compiler;
const metadataLoader = new DirectiveMetadataLoader(new ExtensionsManager);

const fileExports = require(file);

forEach(fileExports, (obj: any) => {
	let metadata: DirectiveDefinition;

	try {
		metadata = metadataLoader.load(obj)
	} catch (e) {
		return;
	}

	process.send({
		directive: {
			file: file,
			type: metadata.type,
			id: metadata.id,
			name: metadata.name,
			template: isString(metadata.template) ? compiler.compile(metadata) : undefined,
		},
	});
});
