import {DirectiveDefinitionType, DirectiveDefinition} from '@slicky/core';
import {Engine} from '@slicky/templates';
import {exists} from '@slicky/utils';
import {SlickyEnginePlugin} from './slickyEnginePlugin';


export class Compiler
{


	private templates: {[hash: number]: string} = {};


	public compile(metadata: DirectiveDefinition): string
	{
		if (exists(this.templates[metadata.hash])) {
			return this.templates[metadata.hash];
		}

		if (metadata.type === DirectiveDefinitionType.Directive) {
			return;
		}

		this.createEngine(metadata).compile(metadata.hash, metadata.template);

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


	private createEngine(metadata: DirectiveDefinition): Engine
	{
		let plugin = new SlickyEnginePlugin(this, metadata);
		let engine = new Engine;

		engine.addPlugin(plugin);
		engine.compiled.subscribe((template) => {
			this.templates[template.name] = template.code;
		});

		return engine;
	}

}
