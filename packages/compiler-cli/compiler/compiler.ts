import {exists, isFunction, forEach, indent} from '@slicky/utils';
import {fork} from 'child_process';
import {writeFileSync} from 'fs';
import * as path from 'path';


export declare interface CompilerTemplatesList
{
	[hash: number]: string;
}


export declare interface CompilerSlickyOptions
{
	outDir: string;
	applicationFile: string;
}


export class Compiler
{


	public compileAndWrite(tsconfigPath: string, done: (outDir: string, factory: string, templates: CompilerTemplatesList) => void = null): void
	{
		this.compile(tsconfigPath, (outDir: string, factory: string, templates: CompilerTemplatesList) => {
			writeFileSync(path.join(outDir, 'app-templates-factory.ts'), factory, {encoding: 'utf8'});

			if (isFunction(done)) {
				done(outDir, factory, templates);
			}
		});
	}


	public compile(tsconfigPath: string, done: (outDir: string, factory: string, templates: CompilerTemplatesList) => void = null): void
	{
		const worker = fork(path.join(__dirname, 'compilerWorker.js'), [], {
			env: {
				TSCONFIG_PATH: tsconfigPath,
			},
		});

		let compilerOptions: CompilerSlickyOptions;
		let templates: CompilerTemplatesList = {};

		worker.on('message', (message) => {
			if (exists(message.error)) {
				throw new Error(message.error);
			}

			if (exists(message.slickyCompilerOptions)) {
				compilerOptions = message.slickyCompilerOptions;
			}

			if (exists(message.template)) {
				templates[message.template.hash] = message.template.template;
			}
		});

		worker.on('exit', (code: number) => {
			if (code !== 0) {
				return;
			}

			const compiledTemplates = this.processTemplates(templates);

			if (isFunction(done)) {
				done(compilerOptions.outDir, compiledTemplates, templates);
			}
		});
	}


	private processTemplates(templates: CompilerTemplatesList): string
	{
		let templateFactories: Array<string> = [];
		let templateMappings: Array<string> = [];

		forEach(templates, (template: string, hash: number) => {
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

		return (
			`import {Template} from '@slicky/templates-runtime/templates';\n\n\n` +
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
	}

}
