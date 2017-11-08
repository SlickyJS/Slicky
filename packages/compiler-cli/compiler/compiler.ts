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


	constructor(tsconfigPath?: string)
	{
		if (exists(tsconfigPath)) {
			this.tsconfigPath = path.resolve(tsconfigPath);
		}
	}


	public compile(done: (err: Error, files: Array<ParsedFile>) => void): void
	{
		const config = this.getConfig();

		this.compileFiles((err, files) => {
			if (err) {
				return done(err, undefined);
			}

			this.removeOldFiles();

			const imports = [];
			const mappings = [];

			forEach(files, (file: ParsedFile) => {
				forEach(file.components, (component: ParsedComponent) => {
					const exportAs = `factory${component.name}`;
					const fileName = `tmpl_${component.name}_${component.name}`;

					const templateData = (
						`export function ${exportAs}()\n` +
						`{\n` +
						`${indent(component.template)};\n` +
						`}\n`
					);

					writeFileSync(path.join(config.outDir, `${fileName}.ts`), templateData, {encoding: 'utf8'});

					imports.push(`import {${exportAs}} from './${fileName}';`);
					mappings.push(`${component.name}: ${exportAs}`);
				});
			});

			const mainTemplate = (
				`${imports.join('\n')}\n\n\n` +
				`const mapping = {\n` +
				`${indent(mappings.join(',\n'))}\n` +
				`};\n\n\n` +
				`export function APP_TEMPLATES_FACTORY(name: string)\n` +
				`{\n` +
				`	if (typeof mapping[name] === 'undefined') {\n` +
				`		throw new Error("Component template " + name + " does not exists.");\n` +
				`	}\n\n` +
				`	return mapping[name]();\n` +
				`}\n`
			);

			writeFileSync(path.join(config.outDir, 'app-templates-factory.ts'), mainTemplate, {encoding: 'utf8'});

			done(undefined, files);
		});
	}


	public compileFile(file: string, done: (err: Error, file: ParsedFile) => void): void
	{
		(new Parser(file)).parse(done);
	}


	public getConfig(): CompilerSlickyOptions
	{
		if (exists(this.config)) {
			return this.config;
		}

		if (!exists(this.tsconfigPath)) {
			throw new Error('CompilerCLI: please, specify your tsconfig.json file');
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


	private compileFiles(done: (err: Error, files: Array<ParsedFile>) => void): void
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
		let error: Error;
		let i = 0;

		forEach(files, (file: string) => {
			if (error) {
				return;
			}

			this.compileFile(file, (err, parsedFile) => {
				if (error) {
					return;
				}

				if (err) {
					error = err;
					return done(err, undefined);
				}

				parsed.push(parsedFile);

				if (++i === files.length) {
					done(undefined, parsed);
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
