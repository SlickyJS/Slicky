import {DirectiveDefinitionType, DirectiveDefinition} from '@slicky/core/metadata';
import {Engine} from '@slicky/templates-compiler';
import {exists} from '@slicky/utils';
import {SlickyEnginePluginManager} from './slickyEnginePluginManager';


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

		const engine = this.createEngine(metadata);

		this.templates[metadata.hash] = engine.compile(metadata.template, {
			name: metadata.hash + '',
			styles: metadata.styles,
			encapsulation: metadata.encapsulation,
		});

		return this.templates[metadata.hash];
	}


	private createEngine(metadata: DirectiveDefinition): Engine
	{
		const engine = new Engine;

		engine.addPlugin(new SlickyEnginePluginManager(metadata));

		return engine;
	}

}
