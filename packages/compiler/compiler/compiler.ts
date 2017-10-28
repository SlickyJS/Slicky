import {DirectiveDefinitionType, DirectiveDefinition} from '@slicky/core/metadata';
import {Engine} from '@slicky/templates-compiler';
import {exists, isString} from '@slicky/utils';
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

		if (!isString(metadata.template)) {
			return;
		}

		const engine = this.createEngine(metadata);

		this.templates[metadata.hash] = engine.compile(<string>metadata.template, {
			name: metadata.hash + '',
			styles: metadata.styles,
			encapsulation: metadata.encapsulation,
		});

		//console.log(this.templates[metadata.hash]);

		return this.templates[metadata.hash];
	}


	private createEngine(metadata: DirectiveDefinition): Engine
	{
		const engine = new Engine;

		engine.addPlugin(new SlickyEnginePlugin(metadata));

		return engine;
	}

}
