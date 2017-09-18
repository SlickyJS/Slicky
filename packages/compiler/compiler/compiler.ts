import {DirectiveDefinitionType, DirectiveDefinition} from '@slicky/core/metadata';
import {Engine} from '@slicky/templates-compiler';
import {exists} from '@slicky/utils';
import {SlickyEnginePlugin} from './slickyEnginePlugin';


export declare interface CompilerOptions
{
	recursiveCompile?: boolean;
}


export class Compiler
{


	private engine: Engine;

	private plugin: SlickyEnginePlugin;

	private templates: {[hash: number]: string} = {};


	constructor()
	{
		this.engine = new Engine;
		this.plugin = new SlickyEnginePlugin;
		this.engine.addPlugin(this.plugin);
	}


	public compile(metadata: DirectiveDefinition, options: CompilerOptions = {}): string
	{
		if (exists(this.templates[metadata.hash])) {
			return this.templates[metadata.hash];
		}

		if (metadata.type === DirectiveDefinitionType.Directive) {
			return;
		}

		const recursiveCompile = exists(options.recursiveCompile) ? options.recursiveCompile : true;

		this.plugin.setComponentMetadata(metadata);

		this.templates[metadata.hash] = this.engine.compile(metadata.template, {
			name: metadata.hash + '',
			styles: metadata.styles,
			encapsulation: metadata.encapsulation,
		});

		if (recursiveCompile) {
			this.plugin.eachCompileComponentRequest((componentMetadata: DirectiveDefinition) => {
				this.compile(componentMetadata);
			});
		}

		return this.templates[metadata.hash];
	}


	public getTemplates(): {[hash: number]: string}
	{
		return this.templates;
	}


	public getTemplateByHash(hash: number): string
	{
		return this.templates[hash];
	}

}
