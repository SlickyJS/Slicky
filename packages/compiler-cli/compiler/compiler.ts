import {exists, isFunction, forEach, indent} from '@slicky/utils';
import {EventEmitter} from '@slicky/event-emitter';
import {fork} from 'child_process';
import {writeFileSync} from 'fs';
import * as path from 'path';


export declare interface CompilerTemplatesList
{
	[hash: number]: string;
}


export declare interface CompilerSlickyOptions
{
	rootDir: string;
	outDir: string;
	exclude: Array<string>;
}


export class Compiler
{


	public onFile = new EventEmitter<string>();

	public onTemplate = new EventEmitter<{file: string, exportName: string, template: string}>();


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

			if (exists(message.log)) {
				console.log(message.log);
			}

			if (exists(message.slickyCompilerOptions)) {
				compilerOptions = message.slickyCompilerOptions;
			}

			if (exists(message.file)) {
				this.onFile.emit(message.file);
			}

			if (exists(message.template)) {
				templates[message.template.hash] = message.template.template;

				this.onTemplate.emit({
					file: message.template.file,
					exportName: message.template.name,
					template: message.template.template,
				});
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
				`${indent(template)};\n` +
				`}\n`
			);

			templateMappings.push(
				`${hash}: _factory${hash}`
			);
		});

		return (
			`${templateFactories.join('\n\n')}\n\n` +
			`const _mapping = {\n` +
			`${indent(templateMappings.join(',\n'))}\n` +
			`};\n\n\n` +
			`export function APP_TEMPLATES_FACTORY(hash: number)\n` +
			`{\n` +
			`	if (typeof _mapping[hash] === 'undefined') {\n` +
			`		throw new Error("Component template " + hash + " does not exists.");\n` +
			`	}\n\n` +
			`	return _mapping[hash]();\n` +
			`}\n`
		);
	}

}
