import {exists, isFunction, forEach, indent} from '@slicky/utils';
import {EventEmitter} from '@slicky/event-emitter';
import {fork} from 'child_process';
import {writeFileSync} from 'fs';
import * as path from 'path';


export declare interface CompiledTemplate
{
	file: string;
	exportAs: string;
	hash: number;
	name: string;
	template: string;
}


export declare interface CompilerSlickyOptions
{
	rootDir: string;
	outDir: string;
	exclude: Array<string>;
}


declare interface TemplateImport
{
	file: string;
	template: CompiledTemplate;
}


export class Compiler
{


	public onFile = new EventEmitter<string>();

	public onTemplate = new EventEmitter<CompiledTemplate>();


	public compileAndWrite(tsconfigPath: string, done?: (outDir: string) => void): void
	{
		const templates: Array<TemplateImport> = [];

		this.compile(tsconfigPath, (outDir, template) => {
			const file = path.join(outDir, `tmpl_${template.name}_${template.hash}.ts`);

			writeFileSync(file, template.template, {encoding: 'utf8'});

			templates.push({
				file: file,
				template: template,
			})
		}, (outDir) => {
			writeFileSync(path.join(outDir, 'app-templates-factory.ts'), this.processTemplates(templates), {encoding: 'utf8'});

			if (isFunction(done)) {
				done(outDir);
			}
		});
	}


	public compile(tsconfigPath: string, onTemplate: (outDir: string, template: CompiledTemplate) => void, onDone: (outDir: string) => void): void
	{
		const worker = fork(path.join(__dirname, 'compilerWorker.js'), [], {
			env: {
				TSCONFIG_PATH: tsconfigPath,
			},
		});

		let compilerOptions: CompilerSlickyOptions;

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
				onTemplate(compilerOptions.outDir, message.template);
				this.onTemplate.emit(message.template);
			}
		});

		worker.on('exit', (code: number) => {
			if (code !== 0) {
				return;
			}

			onDone(compilerOptions.outDir);
		});
	}


	private processTemplates(imports: Array<TemplateImport>): string
	{
		const templateImports = [];
		const mappings = [];

		forEach(imports, (templateImport: TemplateImport) => {
			templateImports.push(`import {${templateImport.template.exportAs}} from './${path.basename(templateImport.file, '.ts')}';`);
			mappings.push(`${templateImport.template.hash}: ${templateImport.template.exportAs}`);
		});

		return (
			`${templateImports.join('\n')}\n\n\n` +
			`const mapping = {\n` +
			`${indent(mappings.join(',\n'))}\n` +
			`};\n\n\n` +
			`export function APP_TEMPLATES_FACTORY(hash: number)\n` +
			`{\n` +
			`	if (typeof mapping[hash] === 'undefined') {\n` +
			`		throw new Error("Component template " + hash + " does not exists.");\n` +
			`	}\n\n` +
			`	return mapping[hash]();\n` +
			`}\n`
		);
	}

}
