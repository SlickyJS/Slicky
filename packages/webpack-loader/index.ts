import {Compiler} from '@slicky/compiler-cli';
import {exists} from '@slicky/utils';
import * as loaderUtils from 'loader-utils';


export default function(source: string, sourcemap): void
{
	const options = loaderUtils.getOptions(this);

	if (!exists(options.configFileName)) {
		throw new Error('@slicky/webpack-loader: missing configFileName option');
	}

	const callback = this.async();
	const compiler = new Compiler(options.configFileName);

	compiler.compileFile(this.resourcePath, (file) => {
		callback(null, file.source, sourcemap);
	});
}
