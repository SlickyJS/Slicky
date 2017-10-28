import {exists, forEach, indent, merge, find} from '@slicky/utils';
import {fork} from 'child_process';
import {writeFileSync, readFileSync, unlinkSync} from 'fs';
import * as path from 'path';
import * as glob from 'glob';


const TSCONFIG_SLICKY_COMPILER_OPTIONS = 'slickyCompilerOptions';


export declare interface CompiledTemplate
{
	file: string,
	hash: number,
	name: string,
	template: string,
}


export declare interface CompilerSlickyOptions
{
	rootDir: string,
	outDir: string,
	exclude: Array<string>,
}


export class Compiler
{


	private tsconfigPath: string;

	private config: CompilerSlickyOptions;


	constructor(tsconfigPath: string)
	{
		this.tsconfigPath = path.resolve(tsconfigPath);
	}


	public compile(done: (templates: Array<CompiledTemplate>) => void): void
	{
		const config = this.getConfig();

		this.compileFiles((templates) => {
			this.removeOldFiles();

			const imports = [];
			const mappings = [];

			forEach(templates, (template: CompiledTemplate) => {
				const exportAs = `factory${template.hash}`;
				const fileName = `tmpl_${template.name}_${template.hash}`;

				const templateData = (
					`export function ${exportAs}()\n` +
					`{\n` +
					`${indent(template.template)};\n` +
					`}\n`
				);

				writeFileSync(path.join(config.outDir, `${fileName}.ts`), templateData, {encoding: 'utf8'});

				imports.push(`import {${exportAs}} from './${fileName}';`);
				mappings.push(`${template.hash}: ${exportAs}`);
			});

			const mainTemplate = (
				`${imports.join('\n')}\n\n\n` +
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

			writeFileSync(path.join(config.outDir, 'app-templates-factory.ts'), mainTemplate, {encoding: 'utf8'});

			done(templates);
		});
	}


	public compileFile(file: string, done: (templates: Array<CompiledTemplate>) => void): void
	{
		const templates: Array<CompiledTemplate> = [];

		const worker = fork(path.join(__dirname, 'compilerWorker.js'), [], {
			env: {
				COMPILE_FILE: file,
				COMPILE_TSCONFIG_FILE: this.tsconfigPath,
			},
		});

		worker.on('message', (message) => {
			if (exists(message.error)) {
				throw new Error(message.error);
			}

			if (exists(message.template)) {
				templates.push(message.template);
			}
		});

		worker.on('exit', (code: number) => {
			if (code !== 0) {
				return;
			}

			done(templates);
		});
	}


	public getConfig(): CompilerSlickyOptions
	{
		if (exists(this.config)) {
			return this.config;
		}

		const tsconfigRoot = path.dirname(this.tsconfigPath);
		const tsconfig = JSON.parse(<string>readFileSync(this.tsconfigPath, {encoding: 'utf8'}));
		const tsconfigSlicky = tsconfig[TSCONFIG_SLICKY_COMPILER_OPTIONS];

		if (!exists(tsconfigSlicky.rootDir)) {
			throw new Error(`Missing "${TSCONFIG_SLICKY_COMPILER_OPTIONS}.rootDir" in ${this.tsconfigPath}`);
		}

		if (!exists(tsconfigSlicky.outDir)) {
			throw new Error(`Missing "${TSCONFIG_SLICKY_COMPILER_OPTIONS}.outDir" in ${this.tsconfigPath}`);
		}

		const slickyCompilerOptions: CompilerSlickyOptions = {
			rootDir: path.join(tsconfigRoot, tsconfigSlicky.rootDir),
			outDir: path.join(tsconfigRoot, tsconfigSlicky.outDir),
			exclude: exists(tsconfigSlicky.exclude) ? tsconfigSlicky.exclude : [],
		};

		slickyCompilerOptions.exclude.push('**/*.d.ts');

		return this.config = slickyCompilerOptions;
	}


	private compileFiles(done: (templates: Array<CompiledTemplate>) => void): void
	{
		const config = this.getConfig();
		const files = glob.sync(path.join('**', '*.ts'), {
			cwd: config.rootDir,
			ignore: config.exclude,
			realpath: true,
			nosort: true,
			nodir: true,
		});

		let templates: Array<CompiledTemplate> = [];
		let i = 0;

		const onDone = () => {
			const result: Array<CompiledTemplate> = [];

			forEach(templates, (template: CompiledTemplate) => {
				const prev = find(result, (findTemplate: CompiledTemplate) => {
					return template.hash === findTemplate.hash;
				});

				if (!exists(prev)) {
					result.push(template);
				}
			});

			done(result);
		};

		forEach(files, (file: string) => {
			this.compileFile(file, (fileTemplates) => {
				templates = merge(templates, fileTemplates);

				if (++i === files.length) {
					onDone();
				}
			});
		});
	}


	private removeOldFiles(): void
	{
		const files = glob.sync('*.ts', {
			cwd: this.getConfig().outDir,
			realpath: true,
			nosort: true,
			nodir: true,
		});

		forEach(files, (file: string) => {
			unlinkSync(file);
		});
	}

}
