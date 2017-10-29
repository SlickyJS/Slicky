import {exists, forEach, indent} from '@slicky/utils';
import {writeFileSync, readFileSync, unlinkSync} from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import {Parser, ParsedFile, ParsedComponent} from './parser';


const TSCONFIG_SLICKY_COMPILER_OPTIONS = 'slickyCompilerOptions';


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


	public compile(done: (files: Array<ParsedFile>) => void): void
	{
		const config = this.getConfig();

		this.compileFiles((files) => {
			this.removeOldFiles();

			const imports = [];
			const mappings = [];

			forEach(files, (file: ParsedFile) => {
				forEach(file.components, (component: ParsedComponent) => {
					const exportAs = `factory${component.id}`;
					const fileName = `tmpl_${component.name}_${component.id}`;

					const templateData = (
						`export function ${exportAs}()\n` +
						`{\n` +
						`${indent(component.template)};\n` +
						`}\n`
					);

					writeFileSync(path.join(config.outDir, `${fileName}.ts`), templateData, {encoding: 'utf8'});

					imports.push(`import {${exportAs}} from './${fileName}';`);
					mappings.push(`${component.id}: ${exportAs}`);
				});
			});

			const mainTemplate = (
				`${imports.join('\n')}\n\n\n` +
				`const mapping = {\n` +
				`${indent(mappings.join(',\n'))}\n` +
				`};\n\n\n` +
				`export function APP_TEMPLATES_FACTORY(id: string)\n` +
				`{\n` +
				`	if (typeof mapping[id] === 'undefined') {\n` +
				`		throw new Error("Component template " + id + " does not exists.");\n` +
				`	}\n\n` +
				`	return mapping[id]();\n` +
				`}\n`
			);

			writeFileSync(path.join(config.outDir, 'app-templates-factory.ts'), mainTemplate, {encoding: 'utf8'});

			done(files);
		});
	}


	public compileFile(file: string, done: (file: ParsedFile) => void): void
	{
		(new Parser(file)).parse(done);
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


	private compileFiles(done: (files: Array<ParsedFile>) => void): void
	{
		const config = this.getConfig();
		const files = glob.sync(path.join('**', '*.ts'), {
			cwd: config.rootDir,
			ignore: config.exclude,
			realpath: true,
			nosort: true,
			nodir: true,
		});

		let parsed: Array<ParsedFile> = [];
		let i = 0;

		forEach(files, (file: string) => {
			this.compileFile(file, (parsedFile) => {
				parsed.push(parsedFile);

				if (++i === files.length) {
					done(parsed);
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
