import 'reflect-metadata';
import {forEach, exists} from '@slicky/utils';
import {DirectiveMetadataLoader, DirectiveDefinition, DirectiveDefinitionType} from '@slicky/core/metadata';
import {ExtensionsManager} from '@slicky/core/extensions';
import {Compiler} from '@slicky/compiler';
import {readFileSync} from 'fs';


const file = process.env.COMPILE_FILE;
const tsconfigPath = process.env.COMPILE_TSCONFIG_FILE;


if (!exists(file)) {
	process.send({error: 'Missing COMPILE_FILE environment variable.'});
	process.exit(1);
}


if (!exists(tsconfigPath)) {
	process.send({error: 'Missing COMPILE_TSCONFIG_FILE environment variable.'});
	process.exit(1);
}


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

	if (metadata.type === DirectiveDefinitionType.Directive) {
		return;
	}

	process.send({
		template: {
			file: file,
			hash: metadata.hash,
			name: metadata.name,
			template: compiler.compile(metadata),
		},
	});
});
