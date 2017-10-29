import {Compiler} from '@slicky/compiler-cli';


export default function(source: string, sourcemap): void
{
	const callback = this.async();
	const compiler = new Compiler;

	compiler.compileFile(this.resourcePath, (file) => {
		callback(null, file.source, sourcemap);
	});
}
